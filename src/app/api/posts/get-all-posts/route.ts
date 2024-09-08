import { connect } from "@/DatabaseConnect/dbConnect";
import { authentication, uploadOnCloudinary } from "@/helpers/helper";
import { Post } from "@/models/Post";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

connect()
    .then(() => console.log("DB Connected"))
    .catch((error: any) => console.log("Error Connecting to database", error));

export const GET = async (req: NextRequest) => {
    try {
        const posts = await Post.find().sort({ updatedAt: -1 });

        if (posts.length === 0) {
            return NextResponse.json(
                { message: "No posts found" },
                { status: 404 } // Use 404 for not found
            );
        }

        return NextResponse.json(
            { message: "Here are all posts", posts },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            { message: "An error occurred while fetching posts" },
            { status: 500 } // Use 500 for internal server errors
        );
    }
};
