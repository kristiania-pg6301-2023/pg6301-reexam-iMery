//Authenticate user
export async function googleAuthUser(req, res, next) {
  const { access_token } = req.signedCookies;
  if (!access_token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const { userinfo_endpoint } = await fetch(
      "https://accounts.google.com/.well-known/openid-configuration",
    ).then((res) => res.json());

    const userinfo = await fetch(userinfo_endpoint, {
      headers: { Authorization: `Bearer ${access_token}` },
    }).then((res) => res.json());

    req.userinfo = userinfo;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.clearCookie("access_token");
    res.status(500).json({ error: "Authentication error" });
  }
}
