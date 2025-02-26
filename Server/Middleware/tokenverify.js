import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
export const adminOnly = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    
    if (error.name === "TokenExpiredError") {
      res
        .status(401)
        .json({ message: "Session expired. Please log in again." });
    } else {
      res.status(400).json({ message: "Invalid token." });
    }
  }
};

export function authenticateTokenUser(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  // console.log("Token received:", token);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log("Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    if (error.name === "TokenExpiredError") {
      res
        .status(401)
        .json({ message: "Session expired. Please log in again." });
    } else {
      res.status(400).json({ message: "Invalid token." });
    }
  }
}
