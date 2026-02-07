const jwt = require("jsonwebtoken");
const users = require("../models/users");

const getToken = (req) => {
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.split(" ")[1];
  }
  return req.cookies?.token || null;
};

const protect = async (req, res, next) => {
  const token = getToken(req);
  if (token) {
    try {
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await users.findOne({ _id: id }).select("_id name");
      if (!req.user) {
        return res.status(401).json({ error: "User not found" });
      }
      return next();
    } catch (error) {
      console.log("JWT error:", error);
      return res.status(401).json({ error: "Request not authorized" });
    }
  }
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Authorization required" });
};
module.exports = { protect };