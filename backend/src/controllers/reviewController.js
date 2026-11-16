
import { Review, Product, Order } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";

// Get Product Reviews
const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({
    product: req.params.productId,
  })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
});

// Create Product Review
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const { productId } = req.params;

  if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !comment?.trim()) {
    res.status(400);
    throw new Error("Valid rating and comment are required");
  }

  const product = await Product.findOne({
    _id: productId,
    isActive: true,
  });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const deliveredOrder = await Order.findOne({
    user: req.user._id,
    orderStatus: "delivered",
    "items.product": productId,
  });

  if (!deliveredOrder) {
    res.status(403);
    throw new Error("Only customers who purchased and received this product can review it");
  }

  const existingReview = await Review.findOne({
    user: req.user._id,
    product: productId,
  });

  if (existingReview) {
    res.status(409);
    throw new Error("You have already reviewed this product");
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating,
    comment: comment.trim(),
  });

  const stats = await Review.aggregate([
    { $match: { product: product._id } },
    {
      $group: {
        _id: "$product",
        average: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  product.ratings.average = Number(stats[0].average.toFixed(1));
  product.ratings.count = stats[0].count;
  await product.save();

  res.status(201).json({
    success: true,
    message: "Review submitted successfully",
    review,
  });
});

// Delete Own Review
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findOne({
    _id: req.params.reviewId,
    user: req.user._id,
  });

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  await review.deleteOne();

  const stats = await Review.aggregate([
    { $match: { product: review.product } },
    {
      $group: {
        _id: "$product",
        average: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const product = await Product.findById(review.product);

  if (product) {
    product.ratings.average = stats.length
      ? Number(stats[0].average.toFixed(1))
      : 0;

    product.ratings.count = stats.length ? stats[0].count : 0;
    await product.save();
  }

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});

export {
  getProductReviews,
  createReview,
  deleteReview,
};
