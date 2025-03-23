const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/users"); // Import your User model

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in your database
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // Create a new user if they don't exist
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: "google-auth", // Placeholder, since Google-authenticated users don't use passwords
            department: "N/A", // Default value, can be updated later
            year: 0, // Default value, can be updated later
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
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
