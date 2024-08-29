import { connect } from "@/DatabaseConnect/dbConnect";
import {
    authentication,
    deleteFromCloudinary,
    uploadOnCloudinary,
} from "@/helpers/helper";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

connect()
    .then(() => console.log("DB Connect SIGNN UP"))
    .catch((error: any) => console.log("Error Connecting to database", error));

interface CloudinaryUploadResult {
    public_id: string;
    url: string;
    secure_url: string;
    [key: string]: any; // Additional fields can be added as needed
}

export const POST = async (req: NextRequest) => {
    const user = await authentication();
    console.log(`\n ~ POST ~ user :- `, user);

    if (!user._id)
        return NextResponse.json({ error: "Not authorised" }, { status: 501 });

    const oldAvatarPublicId = await user?.avatarCloudinaryPublic_ID;
    console.log(`\n ~ POST ~ oldAvatarPublicId :- `, oldAvatarPublicId);

    const formData = await req.formData();
    const image = formData.get("image") as unknown as File;
    console.log(`\n ~ POST ~ image :- `, image);

    const avatarOnCloudinary = await uploadOnCloudinary(
        image,
        "next-js-upload"
    );
    console.log(`\n ~ POST ~ data :- `, avatarOnCloudinary);
    if (!avatarOnCloudinary)
        return NextResponse.json(
            {
                error: "Error while uploading file on database",
            },
            { status: 402 }
        );

    //! set the avatar in user
    user.avatar = avatarOnCloudinary.url;
    user.avatarCloudinaryPublic_ID = avatarOnCloudinary.public_id;
    console.log(`\n ~ changeAvatar ~ NEW :- `, user.avatarCloudinaryPublic_ID);

    try {
        await user.save({ validateBeforeSave: false });
    } catch (error) {
        return NextResponse.json(
            {
                error: "Error while saving avatar",
            },
            { status: 402 }
        );
    }
    const updatedUser = await User.findById(user._id).select("-password");

    // ! DELETE
    console.log(`\n ~ changeAvatar ~ OLD :- `, oldAvatarPublicId);
    if (oldAvatarPublicId) {
        try {
            await deleteFromCloudinary(oldAvatarPublicId);
        } catch (error) {
            return NextResponse.json(
                {
                    error: "Error deleting old image from Cloudinary",
                },
                { status: 400 }
            );
        }
    }

    return NextResponse.json(
        {
            message: "avatar successfully changed!",
            updatedUser,
        },
        { status: 200 }
    );
};

// // Import necessary modules and helpers
// import { NextApiRequest, NextApiResponse } from "next";
// import cloudinary from "cloudinary";
// import dotenv from "dotenv";
// import {
//     authentication,
//     deleteFromCloudinary,
//     uploadOnCloudinary,
// } from "@/helpers/helper";
// import { User } from "@/models/User";
// import { NextResponse } from "next/server";

// // Load environment variables from .env file
// dotenv.config();

// // Configure Cloudinary with your credentials
// cloudinary.v2.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Define the API route handler
// export async function POST(req: NextApiRequest) {
//     const data = await req.formData();

//     const file: File | null = data.get("file") as unknown as File;
//     console.log(`\n ~ POST ~ data :- `, data);

//     if (!data)
//         return NextResponse.json(
//             { message: "No file Data  " },
//             { status: 400 }
//         );

//     // const bytes = await file.arrayBuffer();
//     // const buffer = Buffer.form(bytes);

//     // try {
//     //     console.log(`🦸‍♀️ ~ POST ~ file`);

//     //     const { file } = req.body;
//     //     console.log(`\n ~ POST ~ file :- `, file);

//     //     if (!file) {
//     //         return res.status(400).json({ message: "No file uploaded" });
//     //     }

//     //     const user = await authentication(); // Assuming authentication function returns a user
//     //     const oldAvatarPublicId = user.avatarCloudinaryPublic_ID;

//     //     const avatarOnCloudinary = await uploadOnCloudinary(file);

//     //     if (!avatarOnCloudinary) {
//     //         return res
//     //             .status(500)
//     //             .json({ message: "Error uploading file to Cloudinary" });
//     //     }

//     //     user.avatar = avatarOnCloudinary.url;
//     //     user.avatarCloudinaryPublic_ID = avatarOnCloudinary.public_id;

//     //     try {
//     //         await user.save({ validateBeforeSave: false });
//     //     } catch (error) {
//     //         return res
//     //             .status(500)
//     //             .json({ message: "Error saving user avatar" });
//     //     }

//     //     // If there's an old avatar, delete it from Cloudinary
//     //     if (oldAvatarPublicId) {
//     //         try {
//     //             await deleteFromCloudinary(oldAvatarPublicId);
//     //         } catch (error) {
//     //             console.error(
//     //                 "Error deleting old image from Cloudinary:",
//     //                 error
//     //             );
//     //             return res.status(500).json({
//     //                 message: "Error deleting old image from Cloudinary",
//     //             });
//     //         }
//     //     }

//     //     // Fetch updated user data (excluding password) after avatar update
//     //     const updatedUser = await User.findById(user._id).select("-password");

//     //     // Return success response with updated user data
//     //     return res.status(200).json({ message: "Success", updatedUser });
//     } catch (error) {
//         console.error("Error handling POST request:", error);
//         return res.status(500).json({ error: "Internal Server Error" });
//     }
// }
