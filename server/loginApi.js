import express from "express";
import fetch from "node-fetch";

const router = express.Router();

//Google config
async function googleConfig() {
  const response = await fetch(
    "https://accounts.google.com/.well-known/openid-configuration",
  );
  return response.json();
}

//Check token and get user info
router.use(async (req, res, next) => {
  const { access_token } = req.signedCookies;
  if (access_token) {
    try {
      const { userinfo_endpoint } = await googleConfig();
      const userinfo = await fetch(userinfo_endpoint, {
        headers: { Authorization: `Bearer ${access_token}` },
      }).then((res) => res.json());
      req.userinfo = userinfo;
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }
  next();
});

//Login
router.post("/login", (req, res) => {
  const { access_token } = req.body;
  if (!access_token)
    return res.status(400).json({ error: "No access_token provided" });

  res.cookie("access_token", access_token, {
    signed: true,
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res.sendStatus(204);
});

//Profile user info
router.get("/profile", (req, res) => {
  const { access_token } = req.signedCookies;
  if (!access_token) return res.status(401).json({ error: "Unauthorized" });

  fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
    headers: { Authorization: `Bearer ${access_token}` },
  })
    .then((res) => res.json())
    .then((userinfo) => res.json(userinfo))
    .catch((error) => {
      console.error("Error fetching profile:", error);
      res.status(500).json({ error: "Failed to fetch user profile" });
    });
});

//Logout
router.post("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.sendStatus(204);
});

export default router;
