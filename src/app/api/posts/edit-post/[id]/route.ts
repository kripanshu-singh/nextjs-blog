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

        if (!user || !user._id) {
            return NextResponse.json(
                { error: "Not authorised" },
                { status: 401 }
            );
        }

        const formData = await req.formData();
        const title = formData.get("title") as string;
        const body = formData.get("body") as string;
        const category = formData.get("category") as string;
        const image = formData.get("image") as File;

        if (!title || !body || body.length < 12 || !category) {
            return NextResponse.json(
                {
                    error: "All fields must be filled and body must be at least 12 characters long",
                },
                { status: 400 }
            );
        }

        const oldPost = await Post.findById(id);
        if (!oldPost) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        const oldPublicID = oldPost.thumbnailPublicID;
        const oldThumbnail = oldPost.thumbnail;

        if (!oldPost.creator.equals(user._id)) {
            return NextResponse.json(
                { error: "Only the post owner can edit the post" },
                { status: 403 }
            );
        }

        const lowerCategory = category.toLowerCase();

        if (oldPost.title !== title) {
            const matchedTitle = await Post.findOne({ title });
            if (matchedTitle) {
                return NextResponse.json(
                    { error: "This title is already used" },
                    { status: 400 }
                );
            }
        }

        let newThumbnailUrl = oldThumbnail;
        let newThumbnailPublicID = oldPublicID;

        if (image) {
            const newThumbnailOnCloudinary = await uploadOnCloudinary(
                image,
                "NextJsPostThumbnails"
            );
            if (newThumbnailOnCloudinary) {
                newThumbnailUrl = newThumbnailOnCloudinary.url;
                newThumbnailPublicID = newThumbnailOnCloudinary.public_id;
                await deleteFromCloudinary(oldPublicID);
            } else {
                return NextResponse.json(
                    { error: "Error while uploading file on Cloudinary" },
                    { status: 500 }
                );
            }
        }

        oldPost.title = title;
        oldPost.body = body;
        oldPost.category = lowerCategory;
        oldPost.thumbnail = newThumbnailUrl;
        oldPost.thumbnailPublicID = newThumbnailPublicID;

        const updatedPost = await oldPost.save();
        console.log(`\n ~ POST ~ updatedPost :- `, updatedPost);

        return NextResponse.json(
            {
                message: "Post successfully updated",
                updatedPost,
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
