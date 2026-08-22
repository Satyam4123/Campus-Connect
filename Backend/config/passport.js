const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/users");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const providerEmail = profile.emails?.[0];
        if (!providerEmail?.value || providerEmail.verified !== true) {
          return cb(new Error("Google email is not verified"), null);
        }
        const email = providerEmail.value.toLowerCase();

        let user = await User.findOne({ email });

        if (user) {
          if (!user.googleId) user.googleId = profile.id;
          user.isVerified = true;
          await user.save();
        } else {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email,
            profilePic: profile.photos?.[0]?.value || "",
            isVerified: true,
          });
        }

        return cb(null, user);
      } catch (err) {
        return cb(err, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
