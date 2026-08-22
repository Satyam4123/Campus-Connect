const router = require("express").Router();
const passport = require("passport");
const {
  login,
  signup,
  bootstrapSession,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");
const { protect } = require("../middlewares/protect");
const {
  loginValidation,
  signupValidation,
  recoveryValidation,
  resetValidation,
  tokenValidation,
} = require("../middlewares/validation");
const { authLimiter, captchaRequired } = require("../middlewares/authSecurity");

router.post("/login", authLimiter, captchaRequired, loginValidation, login);
router.post("/signup", authLimiter, captchaRequired, signupValidation, signup);
router.post(
  "/forgot-password",
  authLimiter,
  captchaRequired,
  recoveryValidation,
  forgotPassword,
);
router.post("/reset-password", authLimiter, resetValidation, resetPassword);
router.post("/verify-email", authLimiter, tokenValidation, verifyEmail);
router.get("/bootstrap", protect, bootstrapSession);

router.get(
  "/google",
  authLimiter,
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  authLimiter,
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const clientUrl = process.env.CLIENT_URL;
    const secret = process.env.JWT_SECRET;

    if (!clientUrl) {
      console.error("CLIENT_URL is not set");
      return res
        .status(500)
        .send(
          "Server misconfiguration: CLIENT_URL is not set. Set it in your backend environment variables.",
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
      const jwt = require("jsonwebtoken");
      const token = jwt.sign({ id: req.user._id }, secret, { expiresIn: "7d" });

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.redirect(`${clientUrl}/dashboard`);
    } catch (err) {
      console.error("Google callback error:", err);
      res.redirect(`${clientUrl}/login?error=signin_failed`);
    }
  },
);

// protected
router.get("/profile", protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
