import { User } from "@/models/User";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { connect } from "@/DatabaseConnect/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { uploadOnCloudinary } from "@/helpers/helper";

connect()
    .then(() => console.log("DB Connect SIGNN UP"))
    .catch((error) => console.log("Error Connecting to database", error));

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const username = formData.get("username") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const avatar = formData.get("avatar") as File;
        console.log(`\n ~ POST ~ avatar :- `, avatar);

        // const { username, email, password } = reqbody;

        //! Validations
        if (!avatar) {
            return NextResponse.json(
                { error: "Avatar expected." },
                { status: 400 }
            );
        }

        if (!username.trim() || !email.trim() || !password.trim()) {
            return NextResponse.json(
                { error: "All fields must be filled." },
                { status: 400 }
            );
        }

        const toLowerCaseEmail = email.toLowerCase();

        if (!toLowerCaseEmail.includes("@")) {
            return NextResponse.json({
                error: "Invalid email address",
                status: 400,
            });
        }

        //! check if mail exists
        const existUser = await User.findOne({ email: toLowerCaseEmail });
        if (existUser)
            return NextResponse.json(
                { error: "This email allready exist" },
                { status: 200 }
            );

        //! Hassing the password
        const hashedPassword = await bcryptjs.hash(password, 10);

        const newAvatarOnCloudinary = await uploadOnCloudinary(
            avatar,
            "NextJsAvatars"
        );

        const newUser = new User({
            username,
            email: toLowerCaseEmail,
            password: hashedPassword,
            avatar: newAvatarOnCloudinary.url,
            avatarCloudinaryPublic_ID: newAvatarOnCloudinary.public_id,
        });

        const userResponse = await newUser.save();

        return NextResponse.json(
            { message: "User Created", userResponse },
            { status: 201 }
        );
    } catch (error) {
        console.log(`\n ~ POST ~ error :- `, error);
        process.exit(1);
    }
}
