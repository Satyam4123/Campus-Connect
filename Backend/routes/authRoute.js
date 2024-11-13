const { login, signup } = require("../controllers/auth");
const { protect } = require("../middlewares/protect");
const {
  loginValidation,
  signupValidation,
} = require("../middlewares/validation");
const passport = require("passport");

const router = require("express").Router();

router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.json({message:"Google Authentication successful",
        user:req.user
    });
  }
);
router.get("/profile", protect, (req, res) => {
  res.send(`Welcome ${req.user.displayName}`);
});
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});
module.exports = router;
