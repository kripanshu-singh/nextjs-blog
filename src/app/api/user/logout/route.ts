import { connect } from "@/DatabaseConnect/dbConnect";
import { authentication } from "@/helpers/helper";
import { NextRequest, NextResponse } from "next/server";

const options = {
    httpOnly: true,
    secure: true,
};

connect()
    .then(() => {
        console.log("Connection established successfully");
    })
    .catch((error) => {
        console.error("Connection failed", error);
        return NextResponse.json(
            { error: "Connection failed" },
            { status: 500 }
        );
    });

export async function GET(req: NextRequest) {
    try {
        const user = await authentication();

        if (!user?._id) {
            return NextResponse.json(
                { error: "Invalid Token" },
                { status: 401 }
            );
        }

        const response = NextResponse.json(
            { message: "User logged out successfully" },
            { status: 200 }
        );

        response.cookies.set("accessToken", "", { ...options, maxAge: 0 });
        response.cookies.set("refreshToken", "", { ...options, maxAge: 0 });

        return response;
    } catch (error: any) {
        console.error("Error in GET function:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
