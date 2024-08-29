import { connect } from "@/DatabaseConnect/dbConnect";
import { authentication } from "@/helpers/helper";
import { Post } from "@/models/Post";
import { NextRequest, NextResponse } from "next/server";

// Ensure the database is connected
(async () => {
    try {
        await connect();
        console.log("DB Connected");
    } catch (error) {
        console.error("Error Connecting to database", error);
    }
})();

// Handler for GET requests to /api/posts/category/[slug]
export async function GET(req: NextRequest): Promise<NextResponse> {
    const user = await authentication();
    let id = user._id;
    try {
        const posts = await Post.find({ creator: id });
        console.log(`\n ~ posts :- `, posts);

        if (!posts || posts.length === 0) {
            return NextResponse.json(
                { error: "Posts not found in this id." },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: "Posts found", posts },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in GET handler:", error);
        return NextResponse.json(
            { error: "An error occurred while retrieving the posts" },
            { status: 500 }
        );
    }
}
