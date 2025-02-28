import Post from "../models/Post.js";

//Fetch comments
export const getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    res.status(200).json(post.comments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching comments" });
  }
};

//Add comment
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Comment text required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const userId = req.userinfo?.sub;
    const userName = req.userinfo?.name;

    if (!userId || !userName)
      return res.status(401).json({ error: "Unauthorized" });

    const newComment = {
      userId,
      userName,
      text,
    };

    post.comments.push(newComment);
    post.markModified("comments");
    await post.save();

    res.status(201).json({ message: "Comment added", post });
  } catch (error) {
    res.status(500).json({ error: "Error adding comment" });
  }
};

//Delete comment
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.userinfo?.sub;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.find(
      (comment) => comment._id.toString() === commentId,
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own comments" });
    }

    post.comments = post.comments.filter(
      (comment) => comment._id.toString() !== commentId,
    );
    await post.save();

    res.status(200).json({
      message: "Comment deleted successfully",
      comments: post.comments,
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res
      .status(500)
      .json({ message: "Error deleting comment", error: error.message });
  }
};
