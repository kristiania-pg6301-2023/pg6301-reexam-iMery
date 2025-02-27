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

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors({
    origin: ["http://localhost:3000", "https://maka-social-media-app-66755f89aed5.herokuapp.com"],
    credentials: true
  }));
//login
app.use("/api", loginApi);
//posts
app.use("/api/posts", postRoutes, commentRoutes);
app.use(express.static("../client/dist"));

const PORT = process.env.PORT || 8000; 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
