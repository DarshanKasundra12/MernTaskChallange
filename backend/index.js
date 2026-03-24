import express from "express";
import  databaseConnect  from "./utils/dbConnect.js";
databaseConnect();
import dotenv from "dotenv";
dotenv.config();
import Task from "./routes/taskRoutes.js";

const app = express();
app.use(express.json());

app.get("/testing", (req, res) => {
    res.send("Testing route is working")
});

app.use("/api/task", Task);

app.listen(process.env.PORT, () => {console.log("Server is Running at http://localhost:" + process.env.PORT)});
