import mongoose from "mongoose";

const MONGO_URL:any = process.env.MONGO_URL;

if (!MONGO_URL) {
    throw new Error(
        "Please define the MONGO_URL environment variable inside .env.local"
    );
}

export async function connect() {
    if (mongoose.connection.readyState === 0) {
        try {
            await mongoose.connect(
                MONGO_URL
                // useNewUrlParser: true,
                // useUnifiedTopology: true,
            );
            console.log("Mongoose connected");
        } catch (error) {
            console.error("Error connecting to database:", error);
            throw new Error("Database connection failed");
        }
    }
}
