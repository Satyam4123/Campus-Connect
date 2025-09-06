const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/users");
const bcrypt = require("bcrypt");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile.emails || !profile.emails[0]) {
          return done(new Error("No email found in Google profile"), null);
        }

        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          const hashedPassword = await bcrypt.hash("google-auth-" + Date.now(), 10);
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: hashedPassword,
            department: "N/A",
            year: 0,
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        console.error("Google OAuth error:", err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize the user's ID
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Deserialize the user by ID
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
