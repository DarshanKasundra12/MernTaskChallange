import express from "express";
import  databaseConnect  from "./utils/dbConnect.js";
databaseConnect();
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import Task from "./routes/taskRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration
const raw = process.env.CORS_ORIGINS || "";
const envAllowList = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

// Always allow common local frontend origins for development/testing.
const defaultAllowList = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://mern-task-challange.vercel.app"
];

const allowList = new Set([...defaultAllowList, ...envAllowList]);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowList.has(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.get("/testing", (req, res) => {
    res.send("Testing route is working")
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/task", Task);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {console.log("Server is Running at http://localhost:" + PORT)});
