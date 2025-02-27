import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styling/ProfilePage.css";

const API_URL = import.meta.env.VITE_API_URL;

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/profile`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="profile-page">
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="title">HappySpace</h1>
        <div>
          <button className="nav-button" onClick={() => navigate("/posts")}>
            Posts
          </button>
          <button className="nav-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Profile container */}
      <div className="profile-container">
        {user ? (
          <div className="profile-card">
            <img
              src={
                user.picture ||
                "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
              }
              alt="Profile"
              className="profile-pic-large"
            />
            <div className="profile-info">
              <h2>{user.name}</h2>
              <p>
                <strong>Name:</strong> {user.given_name}
              </p>
              <p>
                <strong>Surname:</strong> {user.family_name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Verified:</strong> {user.verified_email ? "✅" : "❌"}
              </p>
            </div>
          </div>
        ) : (
          <p className="not-logged-in">You are not logged in.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
