import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import multer from "multer";
import { cookies } from "next/headers";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

interface IUser {
    username: string;
    email: string;
    password: string;
    refreshToken: string;
    avatar?: string;
    posts?: number;
}

export async function generateToken(_id: string) {
    try {
        const user: IUser | null = await User.findById(_id);

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const accessToken = jwt.sign(
            { _id: _id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET!,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
            }
        );

        const refreshToken = jwt.sign(
            { _id: _id },
            process.env.REFRESH_TOKEN_SECRET!,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
            }
        );

        return { accessToken, refreshToken };
    } catch (error: any) {
        return NextResponse.json(
            {
                error: error.message || "Something went wrong",
            },
            {
                status: 500,
            }
        );
    }
}

export async function authentication() {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        console.log("Access token not found");
        return NextResponse.json(
            { error: "Access token not found" },
            { status: 401 }
        );
    }

    try {
        const decodedToken = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET!
        );

        if (typeof decodedToken === "string") {
            throw new Error("Invalid access token");
        }

        const user = await User.findById(decodedToken._id);

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 400 }
            );
        } else {
            return user;
        }
    } catch (error: any) {
        console.log(`\n ~ authentication ~ error :- `, error);

        return NextResponse.json(
            { message: "Invalid access token", error },
            { status: 401 }
        );
    }
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
    public_id: string;
    url: string;
    secure_url: string;
    [key: string]: any;
}

export const uploadOnCloudinary = async (
    file: File,
    folder: string
): Promise<CloudinaryUploadResult> => {
    console.log(`\n ~ uploadOnCloudinary ~ folder :- `, folder);
    console.log(`\n ~ uploadOnCloudinary ~ file :- `, file);

    try {
        const buffer = await file.arrayBuffer();
        const bytes = Buffer.from(buffer);

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                    folder: folder,
                },
                (err, result) => {
                    if (err) {
                        reject(
                            new Error(`Cloudinary upload error: ${err.message}`)
                        );
                    } else {
                        resolve(result as CloudinaryUploadResult);
                    }
                }
            );
            uploadStream.end(bytes);
        });
    } catch (error: any) {
        console.error(`Error in uploadOnCloudinary: ${error.message}`);
        throw error;
    }
};

export const deleteFromCloudinary = async (publicId: string) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
    }
};
