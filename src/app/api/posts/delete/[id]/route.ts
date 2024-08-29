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

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    console.log(`\n ~ id :- `, id);
    try {
        const user = await authentication();
        const post = await Post.findById({ _id: id });
        if (!user || !user._id) {
            return NextResponse.json(
                { error: "Not authorised" },
                { status: 200 }
            );
        }
        //! if no post with that id
        // if (!post) throw new ApiError(400, "No post with that id");

        if (!post) {
            return NextResponse.json(
                {
                    error: "No post with that id",
                },
                { status: 200 }
            );
        }

        const oldPublicId = post.thumbnailPublicID;

        const deletePost = await Post.deleteOne({ _id: id });

        await deleteFromCloudinary(oldPublicId);

        if (!deletePost) {
            return NextResponse.json(
                {
                    error: "Error while deleting post",
                },
                { status: 200 }
            );
        }

        await User.findByIdAndUpdate(user._id, { $inc: { posts: -1 } });

        return NextResponse.json(
            {
                message: "Post deleted successfully",
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
