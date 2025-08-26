const { login, signup } = require("../controllers/auth");
const { protect } = require("../middlewares/protect");
const {
  loginValidation,
  signupValidation,
} = require("../middlewares/validation");
const passport = require("../config/passport");

const router = require("express").Router();

router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  }
);

router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

// Protected profile route
router.get("/profile", protect, (req, res) => {
  res.send(`Welcome ${req.user.name}`);
});

// Logout route
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect(`${process.env.CLIENT_URL}`);
  });
});

module.exports = router;
