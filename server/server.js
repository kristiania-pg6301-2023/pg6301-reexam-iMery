import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import loginApi from "./loginApi.js";
import { DBconnection } from "./config/Dbconnection.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();

const app = express();
DBconnection();

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

//login
app.use("/api", loginApi);
//posts
app.use("/api/posts", postRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
