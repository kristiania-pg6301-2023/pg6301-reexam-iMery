import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styling/LoginPage.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function Login() {
  const [authorizationUrl, setAuthorizationUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function generateAuthorizationUrl() {
      const { authorization_endpoint } = await fetch(
        "https://accounts.google.com/.well-known/openid-configuration",
      ).then((res) => res.json());

      const params = new URLSearchParams({
        response_type: "token",
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: window.location.origin + "/callback",
        scope: "profile email",
      });

      setAuthorizationUrl(`${authorization_endpoint}?${params}`);
    }
    generateAuthorizationUrl();
  }, []);

  const enterAsAnonymous = () => {
    navigate("/posts"); //Anonymous users redirected to /post without logging in
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1 className="title">HappySpace</h1>
        <p className="login-text">Join us!</p>
        <a href={authorizationUrl} className="login-button">
          Log in with Google
        </a>
        <button onClick={enterAsAnonymous} className="anonymous-button">
          Enter as Anonymous
        </button>
      </div>
    </div>
  );
}

export default Login;
