import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styling/PostPage.css";

const API_URL = import.meta.env.VITE_API_URL;

function PostPage() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [selectedReactions, setSelectedReactions] = useState(null);
  const [showReactionsModal, setShowReactionsModal] = useState(false);

  //Get user from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    try {
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      setCurrentUser(parsedUser);
      console.log("Parsed user:", parsedUser);
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
  }, []);

  //Fetch posts
  useEffect(() => {
    fetch(`${API_URL}/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch(console.error);
  }, []);

  //Create a post
  const handleAddPost = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ content }),
    });

    if (response.status === 429) {
      const errorData = await response.json();
      alert(errorData.error);
    } else if (response.ok) {
      setContent("");
      refreshPosts();
    } else {
      alert("Error creating post.");
    }

    setLoading(false);
  };

  //Delete a post
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    fetch(`${API_URL}/posts/${postId}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");
        refreshPosts();
      })
      .catch(console.error);
  };

  //React to post
  const handleReactToPost = async (postId, emoji) => {
    try {
      const response = await fetch(`${API_URL}/posts/${postId}/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ emoji }),
      });

      if (!response.ok) throw new Error("Failed to react to post");

      refreshPosts();
    } catch (error) {
      console.error("Reaction error:", error);
    }
  };

  const handleShowReactions = async (postId) => {
    try {
      const response = await fetch(`${API_URL}/posts/${postId}/reactions`);
      if (!response.ok) throw new Error("Failed to fetch reactions");

      const reactionData = await response.json();

      setSelectedReactions(reactionData);
      setShowReactionsModal(true);
    } catch (error) {
      console.error("Error fetching reactions:", error);
    }
  };

  //Edit post
  const handleEditPost = async (post = null) => {
    if (post) {
      setEditingPost(post);
      setEditedContent(post.content);
      setShowEditModal(true);
    } else if (editingPost) {
      try {
        const response = await fetch(`${API_URL}/posts/${editingPost._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content: editedContent }),
        });

        if (!response.ok) throw new Error("Failed to update post");

        setShowEditModal(false);
        setEditingPost(null);
        refreshPosts();
      } catch (error) {
        console.error("Error updating post:", error);
      }
    }
  };

  const refreshPosts = () => {
    fetch(`${API_URL}/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch(console.error);
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="title">HappySpace</h1>
        <div>
          <Link to="/posts" className="nav-button">
            Posts
          </Link>
          <Link to="/profile" className="nav-button">
            Profile
          </Link>
        </div>
      </nav>

      {/* Post form */}
      <div className="post-form-container">
        <h2>Create a Post</h2>
        <form onSubmit={handleAddPost} className="post-form">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            required
          />
          <button type="submit" className="post-button" disabled={loading}>
            {loading ? "Posting..." : "Post"}
          </button>
        </form>
      </div>

      {/* Posts section */}
      <h2 className="posts-heading">Recent Posts</h2>
      <div className="posts-container">
        {posts.length === 0 ? <p>No posts yet.</p> : null}
        {posts.map((post) => (
          <div key={post._id} className="post-container">
            <div className="post-header">
              <img
                src={
                  post?.userProfilePic ||
                  "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                }
                alt="Profile"
                className="profile-pic"
                referrerPolicy="no-referrer"
              />
              <strong>{post.userName}</strong>
            </div>

            <p className="post-content">{post.content}</p>

            {/* Emojis */}
            <div className="reactions">
              {["👍🏼", "❤️", "😹", "🤪"].map((emoji) => (
                <button
                  key={emoji}
                  className={`reaction-button ${
                    post.reactions?.[emoji]?.some(
                      (r) => r.userId === currentUser?.id,
                    )
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleReactToPost(post._id, emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Edit and delete buttons only shows if the user made the post */}
            {currentUser?.id === post.userId && (
              <div className="post-actions">
                <button
                  className="edit-button"
                  onClick={() => handleEditPost(post)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeletePost(post._id)}
                >
                  Delete
                </button>
              </div>
            )}
            <div className="post-actions">
              <button
                className="see-reactions-button"
                onClick={() => handleShowReactions(post._id)}
              >
                See Reactions
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Post</h2>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={() => handleEditPost()} className="save-button">
                Save
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* See Reactions Modal */}
      {showReactionsModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Reactions</h2>
            {selectedReactions && Object.keys(selectedReactions).length > 0 ? (
              <ul className="reaction-list">
                {Object.entries(selectedReactions).map(([emoji, users]) => (
                  <li key={emoji} className="reaction-item">
                    <strong>{emoji}:</strong>{" "}
                    {users.map((user) => user.userName).join(", ")}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No reactions yet.</p>
            )}
            <button
              className="cancel-button"
              onClick={() => setShowReactionsModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostPage;
