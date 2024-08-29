import { connect } from "@/DatabaseConnect/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/User";
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
        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json(
                { error: "user not found. Invalid ID." },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: "user found", user },
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
