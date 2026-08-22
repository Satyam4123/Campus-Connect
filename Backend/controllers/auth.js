const generateJWT = require("../config/jwtGenerate");
const users = require("../models/users");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendAuthEmail } = require("../config/mailer");

const PASSWORD_COST = 12;
const GENERIC_AUTH_MESSAGE =
  "If the details are valid, we will continue the request.";
const DUMMY_PASSWORD_HASH =
  "$2b$12$C6UzMDM.H6dfI/f/IKcEe.4Y6l2n8Qb3H8s5dKp3n2vQ9G4d9zY6W";
const hashToken = (value) =>
  crypto.createHash("sha256").update(value).digest("hex");
const createToken = () => crypto.randomBytes(32).toString("hex");
const delayResponse = async (startedAt) => {
  const remaining = 1000 - (Date.now() - startedAt);
  if (remaining > 0)
    await new Promise((resolve) => setTimeout(resolve, remaining));
};

const signup = async (req, res) => {
  const startedAt = Date.now();
  try {
    const { name, email, password, department, year } = req.body;
    const normalizedEmail = email.toLowerCase();
    const existingUser = await users.findOne({ email: normalizedEmail });
    if (existingUser?.isVerified) {
      await delayResponse(startedAt);
      return res
        .status(202)
        .json({ success: true, message: GENERIC_AUTH_MESSAGE });
    }

    const verificationToken = createToken();
    const user =
      existingUser ||
      new users({
        name,
        email: normalizedEmail,
        password: await bcrypt.hash(password, PASSWORD_COST),
        department,
        year,
      });

    user.emailVerificationTokenHash = hashToken(verificationToken);
    user.emailVerificationTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    try {
      await sendAuthEmail({
        to: normalizedEmail,
        subject: "Verify your Campus Connect email",
        text: `Use this verification token in the verification form: ${verificationToken}`,
      });
    } catch (error) {
      console.error("Verification email delivery error:", error);
      await delayResponse(startedAt);
      return res.status(503).json({
        success: false,
        message:
          "Unable to send the verification email. Please try again later.",
      });
    }
    await delayResponse(startedAt);
    return res
      .status(202)
      .json({ success: true, message: GENERIC_AUTH_MESSAGE });
  } catch (error) {
    console.error("Signup error:", error);
    await delayResponse(startedAt);
    return res.status(500).json({
      success: false,
      message: "Unable to create the account. Please try again later.",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const startedAt = Date.now();
    const user = await users
      .findOne({ email: email.toLowerCase() })
      .select("+password");
    const isLocked =
      user?.loginLockedUntil && user.loginLockedUntil > new Date();
    const isPassEqual = await bcrypt.compare(
      password,
      user?.password || DUMMY_PASSWORD_HASH,
    );
    if (
      !user ||
      !user.password ||
      isLocked ||
      !isPassEqual ||
      !user.isVerified
    ) {
      if (user?.password && !isLocked && !isPassEqual) {
        user.failedLoginAttempts += 1;
        if (user.failedLoginAttempts >= 5)
          user.loginLockedUntil = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();
      }
      await delayResponse(startedAt);
      return res
        .status(401)
        .json({ success: false, message: GENERIC_AUTH_MESSAGE });
    }
    user.failedLoginAttempts = 0;
    user.loginLockedUntil = null;
    await user.save();

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set");
      return res.status(500).json({
        success: false,
        message: "Server configuration error. Please try again later.",
      });
    }
    const jwtToken = generateJWT(user.id);

    // Set JWT in HTTP-only cookie (sameSite: "none" in prod so cookie is sent cross-origin)
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    // Send user info and token (frontend uses token in Authorization header for API calls)
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        name: user.name,
        email: user.email,
        userId: user._id,
        department: user.department,
        year: user.year,
        token: jwtToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const verifyEmail = async (req, res) => {
  const user = await users.findOne({
    emailVerificationTokenHash: hashToken(req.body.token || ""),
    emailVerificationTokenExpiry: { $gt: new Date() },
  });
  if (user) {
    user.isVerified = true;
    user.emailVerificationTokenHash = null;
    user.emailVerificationTokenExpiry = null;
    await user.save();
  }
  return res.status(200).json({
    success: Boolean(user),
    message: user
      ? "Email verified successfully. Please sign in."
      : "Verification token is invalid or expired.",
  });
};

const forgotPassword = async (req, res) => {
  const startedAt = Date.now();
  const user = await users.findOne({ email: req.body.email.toLowerCase() });
  if (user?.password) {
    const resetToken = createToken();
    user.passwordResetTokenHash = hashToken(resetToken);
    user.passwordResetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();
    try {
      await sendAuthEmail({
        to: user.email,
        subject: "Reset your Campus Connect password",
        text: `Use this reset token in the password reset form: ${resetToken}`,
      });
    } catch {
      // Keep recovery responses indistinguishable if delivery is unavailable.
    }
  }
  await delayResponse(startedAt);
  return res.status(202).json({ success: true, message: GENERIC_AUTH_MESSAGE });
};

const resetPassword = async (req, res) => {
  const user = await users
    .findOne({
      passwordResetTokenHash: hashToken(req.body.token || ""),
      passwordResetTokenExpiry: { $gt: new Date() },
    })
    .select("+password");
  if (user) {
    user.password = await bcrypt.hash(req.body.password, PASSWORD_COST);
    user.passwordResetTokenHash = null;
    user.passwordResetTokenExpiry = null;
    user.failedLoginAttempts = 0;
    user.loginLockedUntil = null;
    await user.save();
  }
  return res.status(200).json({ success: true, message: GENERIC_AUTH_MESSAGE });
};

const bootstrapSession = async (req, res) => {
  try {
    const user = await users.findById(req.user._id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ success: false, message: "Server configuration error" });
    }
    res.status(200).json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        userId: user._id,
        department: user.department,
        year: user.year,
      },
    });
  } catch (error) {
    console.error("bootstrapSession error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  login,
  signup,
  bootstrapSession,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
