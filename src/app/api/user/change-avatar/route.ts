import { connect } from "@/DatabaseConnect/dbConnect";
import {
    authentication,
    deleteFromCloudinary,
    uploadOnCloudinary,
} from "@/helpers/helper";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

connect();

export const POST = async (req: NextRequest) => {
    const user = await authentication();
    console.log(`\n ~ POST ~ user :- `, user);

    if (!user || !user._id) {
        return NextResponse.json({ error: "Not authorised" }, { status: 401 });
    }

    const oldAvatarPublicId = user.avatarCloudinaryPublic_ID;
    console.log(`\n ~ POST ~ oldAvatarPublicId :- `, oldAvatarPublicId);

    const formData = await req.formData();
    const image = formData.get("file") as File; // Ensure the key matches the frontend
    console.log(`\n ~ POST ~ image :- `, image);

    if (!image) {
        return NextResponse.json(
            { error: "No image provided" },
            { status: 400 }
        );
    }

    const avatarOnCloudinary = await uploadOnCloudinary(
        image,
        "NextJsAvatars"
    );
    console.log(`\n ~ POST ~ avatarOnCloudinary :- `, avatarOnCloudinary);

    if (!avatarOnCloudinary) {
        return NextResponse.json(
            { error: "Error while uploading file on Cloudinary" },
            { status: 500 }
        );
    }

    // Set the avatar in user
    user.avatar = avatarOnCloudinary.url;
    user.avatarCloudinaryPublic_ID = avatarOnCloudinary.public_id;
    console.log(`\n ~ changeAvatar ~ NEW :- `, user.avatarCloudinaryPublic_ID);

    try {
        await user.save({ validateBeforeSave: false });
    } catch (error) {
        return NextResponse.json(
            { error: "Error while saving avatar" },
            { status: 500 }
        );
    }

    const updatedUser = await User.findById(user._id).select("-password");

    // Delete old avatar from Cloudinary
    if (oldAvatarPublicId) {
        try {
            await deleteFromCloudinary(oldAvatarPublicId);
        } catch (error) {
            return NextResponse.json(
                { error: "Error deleting old image from Cloudinary" },
                { status: 500 }
            );
        }
    }

    return NextResponse.json(
        {
            message: "Avatar successfully changed!",
            updatedUser,
        },
        { status: 200 }
    );
};
