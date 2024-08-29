import { User } from "@/models/User";
import { connect } from "@/DatabaseConnect/dbConnect";
import { NextRequest, NextResponse } from "next/server";

connect()
    .then(() => console.log("DB Connect SIGNN UP"))
    .catch((error) => console.log("Error Connecting to database", error));

export async function GET() {
    try {
        const allUsers = await User.find().sort({ updatedAt: -1 });
        return NextResponse.json(
            { message: "fetched all users", allUsers },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Smoething went wrong while fetching all users" },
            { status: 500 }
        );
    }
}
