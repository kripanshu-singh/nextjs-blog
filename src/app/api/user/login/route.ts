import { connect } from "@/DatabaseConnect/dbConnect";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { generateToken } from "@/helpers/helper";

connect()
    .then(() => {
        console.log("\n\nConnection established\n");
    })
    .catch((error) => {
        console.error("Error in connecting:", error);
    });

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();
        console.log(`\n ~ POST ~ reqBody :- `, reqBody);

        const { email, password } = reqBody;

        // Validate required fields
        if (!email || !password) {
            return NextResponse.json(
                { error: "All fields must be filled." },
                { status: 200 }
            );
        }

        const toLowerCaseEmail = email.toLowerCase();

        // Validate email format
        if (!toLowerCaseEmail.includes("@")) {
            return NextResponse.json(
                { error: "Invalid email address" },
                { status: 200 }
            );
        }

        // Check if email exists
        const existUser = await User.findOne({ email: toLowerCaseEmail });
        console.log(`\n ~ POST ~ existUser :- `, existUser);

        if (!existUser) {
            return NextResponse.json(
                {
                    error: "New user! Try signing up",
                },
                { status: 200 }
            );
        }

        // Match the password
        const isPasswordMatched = await bcryptjs.compare(
            password,
            existUser.password
        );

        if (!isPasswordMatched) {
            return NextResponse.json(
                { error: "Password is not matched" },
                { status: 200 }
            );
        }
        // generateToken(existUser._id);
        // Generate tokens
        const tokens = await generateToken(existUser._id);
        console.log(`\n ~ POST ~ tokens :- `, tokens);

        if ("error" in tokens) {
            return tokens as NextResponse<{ error: any }>;
        }

        const { accessToken, refreshToken } = tokens as {
            accessToken: string;
            refreshToken: string;
        };

        // Update user with refreshToken
        existUser.refreshToken = refreshToken;
        await existUser.save({ validateBeforeSave: false });

        // Exclude password from user details
        const newUser = await User.findById(existUser._id).select("-password");

        // Set cookies and return response
        const options = {
            // httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            // sameSite: "strict" as const,
        };

        const response = NextResponse.json(
            {
                message: "Logged in successfully",
                newUser,
                accessToken,
                refreshToken,
            },
            { status: 201 }
        );

        response.cookies.set("accessToken", accessToken, options);
        response.cookies.set("refreshToken", refreshToken, options);

        return response;
    } catch (error: any) {
        console.error("Error in POST function:", error);
        return NextResponse.json(
            {
                error: error.message || "Something went wrong",
            },
            { status: 500 }
        );
    }
}
