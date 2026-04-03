const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { login, signup, bootstrapSession } = require("../controllers/auth");
const { protect } = require("../middlewares/protect");
const {
  loginValidation,
  signupValidation,
} = require("../middlewares/validation");

router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);
router.get("/bootstrap", protect, bootstrapSession);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const clientUrl = process.env.CLIENT_URL;
    const secret = process.env.JWT_SECRET;

    if (!clientUrl) {
      console.error("CLIENT_URL is not set");
      return res.status(500).send(
        "Server misconfiguration: CLIENT_URL is not set. Set it in your backend environment variables."
      );
    }
    if (!secret) {
      console.error("JWT_SECRET is not set");
      return res.redirect(`${clientUrl}/login?error=config`);
    }
    if (!req.user) {
      return res.redirect(`${clientUrl}/login?error=signin_failed`);
    }

    try {
      const token = jwt.sign({ id: req.user._id }, secret, {
        expiresIn: "7d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      // Hash is not sent to the server; SPA reads it and stores token for API calls.
      // Cookie alone often fails cross-site XHR (browser blocks third-party cookies).
      const hashToken = encodeURIComponent(token);
      res.redirect(`${clientUrl}/dashboard#token=${hashToken}`);
    } catch (err) {
      console.error("Google callback error:", err);
      res.redirect(`${clientUrl}/login?error=signin_failed`);
    }
  }
);

// protected
router.get("/profile", protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
