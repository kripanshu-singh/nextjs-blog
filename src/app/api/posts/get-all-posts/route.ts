import { connect } from "@/DatabaseConnect/dbConnect";
import { authentication, uploadOnCloudinary } from "@/helpers/helper";
import { Post } from "@/models/Post";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

connect()
    .then(() => console.log("DB Connect SIGNN UP"))
    .catch((error: any) => console.log("Error Connecting to database", error));

export const GET = async (req: NextRequest) => {
    const posts = await Post.find().sort({ updatedAt: -1 });

    if (!posts)
        return NextResponse.json(
            {
                message: "No post found",
            },
            { status: 400 }
        );

    //! if posts are there then send them
    return NextResponse.json(
        { message: "Here is all posts", posts },
        { status: 200 }
    );
};
