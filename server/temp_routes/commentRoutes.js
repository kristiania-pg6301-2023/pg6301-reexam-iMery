import express from "express";
import {
  addComment,
  getComments,
  deleteComment,
} from "../controllers/commentController.js";
import { googleAuthUser } from "../middleware/authUser.js";

const router = express.Router();

//Get comments
router.get("/:id/comments", getComments);
//Add a comment
router.post("/:id/comment", googleAuthUser, addComment);
//Delete a comment
router.delete("/:postId/comment/:commentId", googleAuthUser, deleteComment);

export default router;
