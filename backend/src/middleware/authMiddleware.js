
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, token missing");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user || !user.isActive) {
      res.status(401);
      throw new Error("User not authorized");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    next(new Error("Not authorized, invalid or expired token"));
  }
};

export { protect };
