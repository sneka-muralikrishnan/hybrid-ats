import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Verify the token and attach user info
export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  if (!token)
    return res.status(401).json({ message: "Not authorized, no token" });
};

// ✅ Check if user is admin
export const verifyAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: "Error verifying admin access." });
  }
};
