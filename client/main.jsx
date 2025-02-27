import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage.jsx";
import Profile from "./pages/ProfilePage.jsx";
import PostPage from "./pages/PostPage.jsx";
import LoginCallback from "./pages/loginCallback.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/callback" element={<LoginCallback />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/posts" element={<PostPage />} />
    </Routes>
  </Router>,
);
