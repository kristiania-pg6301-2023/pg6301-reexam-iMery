import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import loginApi from "./loginApi.js";
import { DBconnection } from "./config/Dbconnection.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";



dotenv.config();

const app = express();
DBconnection();
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors({
    origin: ["http://localhost:3000", "https://social-media-app-maka-cda458daeb4b.herokuapp.com"],
    credentials: true
  }));
//login
app.use("/api", loginApi);
//posts
app.use("/api/posts", postRoutes, commentRoutes);
app.use(express.static("../client/dist"));

app.use(express.static(path.join(__dirname, "dist"))); 

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 8000; 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
