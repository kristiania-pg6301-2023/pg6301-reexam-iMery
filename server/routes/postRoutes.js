import express from "express";
import {
  addPost,
  getPosts,
  deletePost,
  addReaction,
  editPost,
  getPostReactions,
} from "../controllers/postController.js";
import { googleAuthUser } from "../middleware/authUser.js";

const router = express.Router();

router.get("/", getPosts); //Fetching without aauthentication so anonymos users cen see posts
router.post("/", googleAuthUser, addPost);
router.delete("/:id", googleAuthUser, deletePost);
router.put("/:id", googleAuthUser, editPost);
router.post("/:id/reaction", googleAuthUser, addReaction);
router.get("/:id/reactions", getPostReactions);

export default router;
