import mongoose from "mongoose";

function isLocalMongoUri(uri) {
    if (!uri) return false;
    return uri.includes("localhost:27017") || uri.includes("127.0.0.1:27017") || uri.includes("::1:27017");
}

const databaseConnect = async () => {
    const mongoUrl = process.env.MONGO_URL;

    if (!mongoUrl) {
        throw new Error("MONGO_URL is not set. Configure it in environment variables.");
    }

    if (process.env.NODE_ENV === "production" && isLocalMongoUri(mongoUrl)) {
        throw new Error("MONGO_URL points to localhost in production. Use MongoDB Atlas/hosted URI.");
    }

    await mongoose.connect(mongoUrl, {
        serverSelectionTimeoutMS: 10000,
    });

    console.log("Connected to MongoDB");
};

export default databaseConnect;
