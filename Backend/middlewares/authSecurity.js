const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Authentication request unavailable" },
});

const captchaRequired = async (req, res, next) => {
  const threshold = Number(process.env.CAPTCHA_AFTER || 5);
  if (Number(req.rateLimit?.used || 0) <= threshold) return next();
  if (!process.env.CAPTCHA_SECRET || !req.body.captchaToken) {
    return res
      .status(429)
      .json({ success: false, message: "Authentication request unavailable" });
  }
  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.CAPTCHA_SECRET,
          response: req.body.captchaToken,
        }),
      },
    );
    const result = await response.json();
    if (!result.success)
      return res
        .status(429)
        .json({
          success: false,
          message: "Authentication request unavailable",
        });
    next();
  } catch {
    res
      .status(429)
      .json({ success: false, message: "Authentication request unavailable" });
  }
};

module.exports = { authLimiter, captchaRequired };
