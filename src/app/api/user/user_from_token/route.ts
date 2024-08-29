import { connect } from "@/DatabaseConnect/dbConnect";
import { authentication } from "@/helpers/helper";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

connect()
    .then(() => {
        console.log("DB Connected");
    })
    .catch(() => {
        console.log("Error in DB Connecting");
    });

export async function GET(req: NextRequest) {
    try {
        const user = await authentication();
        // console.log(`\n ~ GET ~ token :- `, user._id);

        if (!user._id) {
            return NextResponse.json(
                { error: "Invalid Tokkens" },
                { status: 200 }
            );
        }

        const response = NextResponse.json(
            { message: "User found", user },
            { status: 200 }
        );

        return response;
    } catch (error: any) {
        console.error("Error in GET function:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
