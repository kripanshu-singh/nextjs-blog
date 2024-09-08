import { connect } from "@/DatabaseConnect/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { Post } from "@/models/Post";

// Establish a database connection inside the GET handler
export const GET = async (req: NextRequest) => {
    try {
        await connect(); // Ensure DB connection

        // Fetch all posts and sort them by updatedAt in descending order
        const posts = await Post.find().sort({ updatedAt: -1 });

        if (!posts || posts.length === 0) {
            return NextResponse.json(
                { message: "No posts found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Here are all posts", posts },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            { message: "Error fetching posts", error: error.message },
            { status: 500 }
        );
    }
};
