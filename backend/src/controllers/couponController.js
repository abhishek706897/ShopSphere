
import { Coupon } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";

// Get Active Coupons
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({
    isActive: true,
    expiresAt: { $gt: new Date() },
  }).select("-usedCount -usageLimit");

  res.status(200).json({
    success: true,
    count: coupons.length,
    coupons,
  });
});

// Validate Coupon
const validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderAmount } = req.body;

  if (!code || typeof orderAmount !== "number" || orderAmount <= 0) {
    res.status(400);
    throw new Error("Valid coupon code and order amount are required");
  }

  const coupon = await Coupon.findOne({
    code: code.trim().toUpperCase(),
    isActive: true,
  });

  if (!coupon) {
    res.status(404);
    throw new Error("Invalid coupon code");
  }

  if (coupon.expiresAt <= new Date()) {
    res.status(400);
    throw new Error("Coupon has expired");
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    res.status(400);
    throw new Error("Coupon usage limit reached");
  }

  if (orderAmount < coupon.minimumOrderAmount) {
    res.status(400);
    throw new Error(
      `Minimum order amount is ${coupon.minimumOrderAmount}`
    );
  }

  let discount = 0;

  if (coupon.discountType === "percentage") {
    discount = (orderAmount * coupon.discountValue) / 100;

    if (coupon.maximumDiscount > 0) {
      discount = Math.min(discount, coupon.maximumDiscount);
    }
  } else {
    discount = coupon.discountValue;
  }

  discount = Math.min(discount, orderAmount);

  res.status(200).json({
    success: true,
    message: "Coupon applied successfully",
    coupon: {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
    },
    discount,
    finalAmount: orderAmount - discount,
  });
});

// Create Coupon (Admin)
const createCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    description,
    discountType,
    discountValue,
    minimumOrderAmount,
    maximumDiscount,
    usageLimit,
    expiresAt,
  } = req.body;

  if (
    !code ||
    !["percentage", "fixed"].includes(discountType) ||
    typeof discountValue !== "number" ||
    discountValue <= 0 ||
    !expiresAt ||
    new Date(expiresAt) <= new Date()
  ) {
    res.status(400);
    throw new Error("Please provide valid coupon details");
  }

  if (discountType === "percentage" && discountValue > 100) {
    res.status(400);
    throw new Error("Percentage discount cannot exceed 100");
  }

  const existingCoupon = await Coupon.findOne({
    code: code.trim().toUpperCase(),
  });

  if (existingCoupon) {
    res.status(409);
    throw new Error("Coupon code already exists");
  }

  const coupon = await Coupon.create({
    code: code.trim().toUpperCase(),
    description,
    discountType,
    discountValue,
    minimumOrderAmount,
    maximumDiscount,
    usageLimit,
    expiresAt,
  });

  res.status(201).json({
    success: true,
    message: "Coupon created successfully",
    coupon,
  });
});

// Update Coupon (Admin)
const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  const allowedFields = [
    "description",
    "discountType",
    "discountValue",
    "minimumOrderAmount",
    "maximumDiscount",
    "usageLimit",
    "expiresAt",
    "isActive",
  ];

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      coupon[field] = req.body[field];
    }
  }

  if (
    !["percentage", "fixed"].includes(coupon.discountType) ||
    coupon.discountValue <= 0 ||
    (coupon.discountType === "percentage" && coupon.discountValue > 100) ||
    new Date(coupon.expiresAt) <= new Date()
  ) {
    res.status(400);
    throw new Error("Invalid coupon details");
  }

  await coupon.save();

  res.status(200).json({
    success: true,
    message: "Coupon updated successfully",
    coupon,
  });
});

// Delete Coupon (Admin)
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  await coupon.deleteOne();

  res.status(200).json({
    success: true,
    message: "Coupon deleted successfully",
  });
});

export {
  getCoupons,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
