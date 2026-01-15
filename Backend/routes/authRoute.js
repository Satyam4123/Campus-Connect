const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { login, signup } = require("../controllers/auth");
const { protect } = require("../middlewares/protect");
const {
  loginValidation,
  signupValidation,
} = require("../middlewares/validation");

router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  }
);

// protected
router.get("/profile", protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
