
import { Wishlist, Product } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";

// Get Wishlist
const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({
    user: req.user._id,
  }).populate("products", "name price images ratings");

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      products: [],
    });
  }

  res.status(200).json({
    success: true,
    wishlist,
  });
});

// Add Product To Wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error("Product ID is required");
  }

  const product = await Product.findOne({
    _id: productId,
    isActive: true,
  });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  let wishlist = await Wishlist.findOne({
    user: req.user._id,
  });

  if (!wishlist) {
    wishlist = new Wishlist({
      user: req.user._id,
      products: [],
    });
  }

  const alreadyExists = wishlist.products.some(
    (id) => id.toString() === productId
  );

  if (alreadyExists) {
    res.status(409);
    throw new Error("Product already exists in wishlist");
  }

  wishlist.products.push(productId);
  await wishlist.save();

  await wishlist.populate("products", "name price images ratings");

  res.status(200).json({
    success: true,
    message: "Product added to wishlist",
    wishlist,
  });
});

// Remove Product From Wishlist
const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({
    user: req.user._id,
  });

  if (!wishlist) {
    res.status(404);
    throw new Error("Wishlist not found");
  }

  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== req.params.productId
  );

  await wishlist.save();

  res.status(200).json({
    success: true,
    message: "Product removed from wishlist",
    wishlist,
  });
});

export {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
