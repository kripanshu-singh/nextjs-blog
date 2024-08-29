import { connect } from "@/DatabaseConnect/dbConnect";
import { NextRequest, NextResponse } from "next/server";

connect()
    .then(() => {
        console.log("Database connection attempted");
    })
    .catch((error) => {
        console.error("Error connecting to database:", error);
    });

async function POST(req: NextRequest) {
    NextResponse.json({
        message: "Success",
        status: 200,
    });
}
