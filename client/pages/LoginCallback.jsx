import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function LoginCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = Object.fromEntries(
      new URLSearchParams(window.location.hash.substring(1)),
    );

    if (params.access_token) {
      fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: params.access_token }),
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Login failed");
          return res.text();
        })
        .then(() => {
          console.log("Login successful, fetching user data");
          //Ftech user profile
          return fetch(`${API_URL}/profile`, { credentials: "include" });
        })
        .then((res) => res.json())
        .then((user) => {
          console.log("Fetched user:", user);
          localStorage.setItem("user", JSON.stringify(user)); //Store user
          navigate("/posts");
        })
        .catch((error) => {
          console.error("Login error:", error);
          navigate("/"); //If it fails redirect to login page
        });
    }
  }, []);

  return <div>Redirecting...</div>;
}

export default LoginCallback;
