import Post from "../models/Post.js";

//Create a post
export const addPost = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.length < 10)
      return res
        .status(400)
        .json({ error: "Post must have at least 10 words." });

    if (!req.userinfo) return res.status(401).json({ error: "Unauthorized" });

    const userId = req.userinfo.sub; //Sub from google user
    const userName = req.userinfo.name;
    const userEmail = req.userinfo.email;
    const userProfilePic = req.userinfo.picture;

    //Only 5 posts every hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const postCount = await Post.countDocuments({
      userId,
      createdAt: { $gte: oneHourAgo },
    });

    if (postCount >= 5)
      return res
        .status(429)
        .json({ error: "You can only post 5 posts every hour!" });

    //Create and save in database
    const newPost = await Post.create({
      userId,
      userName,
      content,
      userEmail,
      userProfilePic,
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Error creating post" });
  }
};

//Get posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts" });
  }
};

//React to post
export const addReaction = async (req, res) => {
  try {
    const { emoji } = req.body;
    if (!emoji) return res.status(400).json({ error: "Reaction required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const userId = req.userinfo?.sub;
    const userName = req.userinfo?.name;

    if (!userId || !userName)
      return res.status(401).json({ error: "Unauthorized" });

    post.reactions ||= {};

    //Find previous reaction
    let previousEmoji = Object.keys(post.reactions).find((key) =>
      post.reactions[key].some((r) => r.userId === userId),
    );

    //If user is switching emoji remove previous one
    if (previousEmoji && previousEmoji !== emoji) {
      post.reactions[previousEmoji] = post.reactions[previousEmoji].filter(
        (r) => r.userId !== userId,
      );
      if (!post.reactions[previousEmoji].length)
        delete post.reactions[previousEmoji];
    }

    post.reactions[emoji] ||= [];

    //Check if user reacted with emoji
    const hasReacted = post.reactions[emoji].some((r) => r.userId === userId);
    //Remove emoji (unlike it)
    if (hasReacted) {
      post.reactions[emoji] = post.reactions[emoji].filter(
        (r) => r.userId !== userId,
      );
      if (!post.reactions[emoji].length) delete post.reactions[emoji];
    } else {
      //Add emoji as object with usernam and id
      post.reactions[emoji].push({ userId, userName });
    }

    post.markModified("reactions");
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Error adding reaction" });
  }
};

//Delete  post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.userId !== req.userinfo.sub) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Error deleting post" });
  }
};

//edit a post
export const editPost = async (req, res) => {
  try {
    const { content } = req.body;
    const { id } = req.params;

    if (!content || content.length < 10)
      return res
        .status(400)
        .json({ error: "Post must have at least 10 characters." });

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.userId !== req.userinfo.sub) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    post.content = content;
    await post.save();

    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Error editing post" });
  }
};

//Fetch reactions
export const getPostReactions = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    res.status(200).json(post.reactions);
  } catch (error) {
    console.error("Error fetching reactions:", error);
    res.status(500).json({ error: "Error fetching reactions" });
  }
};
