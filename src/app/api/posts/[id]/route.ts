import { connect } from "@/DatabaseConnect/dbConnect";
import { Post } from "@/models/Post";
import { NextRequest, NextResponse } from "next/server";

// Ensure the database is connected
connect()
    .then(() => console.log("DB Connected"))
    .catch((error: any) => console.log("Error Connecting to database", error));

// Handler for GET requests to /api/posts/[id]
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    console.log(`\n ~ id :- `, id);
    
    try {
        const post = await Post.findById(id);

        if (!post) {
            return NextResponse.json(
                { error: "Post not found. Invalid ID." },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: "Post found", post },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error in GET handler:", error);
        return NextResponse.json(
            { error: "An error occurred while retrieving the post" },
            { status: 500 }
        );
    }
}
