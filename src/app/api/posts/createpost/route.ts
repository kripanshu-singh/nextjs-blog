import { connect } from "@/DatabaseConnect/dbConnect";
import { authentication, uploadOnCloudinary } from "@/helpers/helper";
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

export async function POST(req: NextRequest) {
    try {
        const user = await authentication();
        console.log(`\n ~ POST ~ user :- `, user);

        if (!user || !user._id) {
            return NextResponse.json(
                { error: "Not authorised" },
                { status: 200 }
            );
        }
        const formData = await req.formData();
        console.log(`\n ~ POST ~ formData :- `, formData);

        const title = formData.get("title");
        console.log(`\n ~ POST ~ title :- `, title);

        const body = formData.get("body") as string;
        console.log(`\n ~ POST ~ body :- `, body);

        const category = formData.get("category") as string;
        console.log(`\n ~ POST ~ tags :- `, category);

        const image = formData.get("image") as File;
        console.log(`\n ~ POST ~ image :- `, image);

        if (!title || !body || !category) {
            return NextResponse.json(
                {
                    error: "All fields must be filled",
                },
                { status: 200 }
            );
        }

        const lowerCategory = category.toLowerCase();
        const matchedTitle = await Post.findOne({ title });
        if (matchedTitle) {
            return NextResponse.json(
                { error: "This title is already used" },
                { status: 200 }
            );
        }
        const newThumbnailOnCloudinary = await uploadOnCloudinary(
            image,
            "NextJsPostThumbnails"
        );

        console.log(`\n ~ POST ~ user._id :- `, user._id);
        console.log(`\n ~ POST ~ user._id :- `, user.avatar);

        const newPost = new Post({
            title,
            body,
            category: lowerCategory,
            creator: user._id,
            creatorAvatar: user.avatar,
            creatorName: user.username,
            thumbnail: newThumbnailOnCloudinary.url,
            thumbnailPublicID: newThumbnailOnCloudinary.public_id,
        });
        console.log(`\n ~ POST ~ createPost :- `, newPost);

        const postResponse = await newPost.save();
        console.log(`\n ~ POST ~ postResponse :- `, postResponse);

        await User.findByIdAndUpdate(user._id, { $inc: { posts: 1 } });

        return NextResponse.json(
            {
                message: "Post successfully created",
                postResponse,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in POST handler:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
