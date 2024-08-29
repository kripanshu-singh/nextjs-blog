import { connect } from "@/DatabaseConnect/dbConnect";
import {
    authentication,
    deleteFromCloudinary,
    uploadOnCloudinary,
} from "@/helpers/helper";
import { Post } from "@/models/Post";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// Ensuring database connection is established before handling requests
connect()
    .then(() => {
        console.log("DB Connected");
    })
    .catch((error: any) => {
        console.error("Error Connecting to database", error);
    });

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    console.log(`\n ~ id :- `, id);

    try {
        const user = await authentication(); // Pass the request object to the authentication function
        console.log(`\n ~ POST ~ user :- `, user);
        console.log(`\n ~ POST ~ user :- `, user._id);
        console.log(`\n ~ POST ~ user :- `, user.username);

        if (!user || !user._id) {
            return NextResponse.json(
                { error: "Not authorised" },
                { status: 401 }
            );
        }

        // const user = await User.findById(id);
        // console.log(`\n ~ POST ~ user :- `, user);
        // console.log(`\n ~ POST ~ user :- `, user._id);
        // console.log(`\n ~ POST ~ user :- `, user.username);

        // if (!user || !user._id) {
        //     return NextResponse.json(
        //         { error: "Not authorised" },
        //         { status: 401 }
        //     );
        // }

        const formData = await req.formData();
        console.log(`\n ~ formData :- `, formData);

        const username = formData.get("username") as string;
        const avatar = formData.get("avatar") as File;

        const oldPublicID = user.avatarCloudinaryPublic_ID;
        const oldAvatar = user.avatar;

        let newAvatarUrl = oldAvatar;
        let newAvatarPublicID = oldPublicID;

        if (avatar) {
            const newAvatarOnCloudinary = await uploadOnCloudinary(
                avatar,
                "NextJsAvatars"
            );
            if (newAvatarOnCloudinary) {
                newAvatarUrl = newAvatarOnCloudinary.url;
                newAvatarPublicID = newAvatarOnCloudinary.public_id;
                await deleteFromCloudinary(oldPublicID);
            } else {
                return NextResponse.json(
                    { error: "Error while uploading file on Cloudinary" },
                    { status: 500 }
                );
            }
        }

        // user.username = username;
        // user.avatar = newAvatarUrl;
        // user.avatarCloudinaryPublic_ID = newAvatarPublicID;

        // const updatedPost = await user.save();
        const newUser = await User.findByIdAndUpdate(
            user._id,
            {
                username,
                avatar: newAvatarUrl,
            },
            { new: true }
        ).select("-password");
        return NextResponse.json(
            {
                message: "Post successfully updated",
                newUser,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in POST handler:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
