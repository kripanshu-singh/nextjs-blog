import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IPost extends Document {
    title: string;
    body: string;
    category?: string;
    thumbnail?: string;
    thumbnailPublicID?: string;
    creator?: any;
    // creatorAvatar?: string;
    // creatorName?: string;
}

const PostSchema: Schema<IPost> = new Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        body: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: [
                "travel",
                "entertainment",
                "lifestyle",
                "food",
                "health",
                "technology",
                "education",
                "finance",
                "fashion_beauty",
                "dIY_craft",
                "uncategorized",
            ],
        },
        thumbnail: {
            type: String,
            required: false,
        },
        thumbnailPublicID: {
            type: String,
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

// export const Post = model("Post", postSchema);
export const Post = models.Post || model<IPost>("Post", PostSchema);
