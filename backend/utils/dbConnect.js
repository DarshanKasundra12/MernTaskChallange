import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const databaseConnect = () => mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log(err));

export default databaseConnect;