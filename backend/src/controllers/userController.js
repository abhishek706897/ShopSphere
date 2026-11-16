
import { User } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import { hashPassword } from "../utils/passwordUtils.js";

// Get User Profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name?.trim() || user.name;

  if (req.body.email) {
    const email = req.body.email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email,
      _id: { $ne: user._id },
    });

    if (existingUser) {
      res.status(409);
      throw new Error("Email already in use");
    }

    user.email = email;
  }

  if (req.body.password) {
    if (req.body.password.length < 8) {
      res.status(400);
      throw new Error("Password must be at least 8 characters");
    }

    user.password = await hashPassword(req.body.password);
  }

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    },
  });
});

export { getUserProfile, updateUserProfile };
