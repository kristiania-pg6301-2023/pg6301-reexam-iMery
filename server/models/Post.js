import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    content: { type: String, required: true, minlength: 10, maxlength: 1000 }, //Content between 10 and 1000 words
    reactions: { type: Object, default: {} },
    userProfilePic: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    comments: [
      {
        userId: { type: String, required: true },
        userName: { type: String, required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Post", postSchema);
