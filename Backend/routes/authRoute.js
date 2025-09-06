const { login, signup } = require("../controllers/auth");
const { protect } = require("../middlewares/protect");
const {
  loginValidation,
  signupValidation,
} = require("../middlewares/validation");
const passport = require("../config/passport");
const generateJWT = require("../config/jwtGenerate");

const router = require("express").Router();

router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL}/login` }),
  (req, res) => {
    try {
      const jwtToken = generateJWT(req.user.id);
      const userData = {
        name: req.user.name,
        email: req.user.email,
        jwtToken,
        userId: req.user._id,
        department: req.user.department,
        year: req.user.year
      };
      
      const encodedData = encodeURIComponent(JSON.stringify(userData));
      res.redirect(`${process.env.CLIENT_URL}/dashboard?auth=${encodedData}`);
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
    }
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
