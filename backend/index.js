import express from "express";
import  databaseConnect  from "./utils/dbConnect.js";
databaseConnect();
import dotenv from "dotenv";
dotenv.config();
import Task from "./routes/taskRoutes.js";

const app = express();
app.use(express.json());

// Minimal CORS for browser-based frontends (Vercel, etc.).
// Configure in your backend environment as:
// CORS_ORIGINS=https://mern-task-challange.vercel.app,https://your-custom-domain.com
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const raw = process.env.CORS_ORIGINS || "";
    const allowList = raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    if (allowList.length === 0) {
        // Default: allow any origin (good for quick testing). Tighten in production via CORS_ORIGINS.
        res.setHeader("Access-Control-Allow-Origin", "*");
    } else if (origin && allowList.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Vary", "Origin");
    }

    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

app.get("/testing", (req, res) => {
    res.send("Testing route is working")
});

app.use("/api/task", Task);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {console.log("Server is Running at http://localhost:" + PORT)});
