import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    refreshToken: string;
    avatar?: string;
    posts?: number;
    description?: string;
    avatarCloudinaryPublic_ID?: string;
}

const userSchema: Schema<IUser> = new Schema(
    {
        username: {
            type: String,
            required: [true, "Please enter a Name"],
        },
        email: {
            type: String,
            required: [true, "Please enter your Email"],
        },
        password: {
            type: String,
            required: [true, "Please enter a Password"],
        },
        description: {
            type: String,
        },
        posts: {
            type: Number,
            default: 0,
        },
        refreshToken: {
            type: String,
        },
        avatar: {
            type: String,
        },
        avatarCloudinaryPublic_ID: {
            type: String,
            // required: true,
        },
    },
    { timestamps: true }
);

export const User = models.User || model<IUser>("User", userSchema);
