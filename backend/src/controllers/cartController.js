
import { Cart, Product } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";

// Get User Cart
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "name price images stock"
  );

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  res.status(200).json({
    success: true,
    cart,
  });
});

// Add Product To Cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId || !Number.isInteger(quantity) || quantity < 1) {
    res.status(400);
    throw new Error("Valid product ID and quantity are required");
  }

  const product = await Product.findOne({
    _id: productId,
    isActive: true,
  });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error("Insufficient product stock");
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    if (existingItem.quantity + quantity > product.stock) {
      res.status(400);
      throw new Error("Requested quantity exceeds available stock");
    }

    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  await cart.populate("items.product", "name price images stock");

  res.status(200).json({
    success: true,
    message: "Product added to cart",
    cart,
  });
});

// Update Cart Item Quantity
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  if (!Number.isInteger(quantity) || quantity < 1) {
    res.status(400);
    throw new Error("Quantity must be a positive integer");
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const item = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (!item) {
    res.status(404);
    throw new Error("Product not found in cart");
  }

  const product = await Product.findById(productId);

  if (!product || !product.isActive || quantity > product.stock) {
    res.status(400);
    throw new Error("Requested quantity is unavailable");
  }

  item.quantity = quantity;

  await cart.save();
  await cart.populate("items.product", "name price images stock");

  res.status(200).json({
    success: true,
    message: "Cart quantity updated",
    cart,
  });
});

// Remove Product From Cart
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== req.params.productId
  );

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Product removed from cart",
    cart,
  });
});

// Clear Cart
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.items = [];
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
  });
});

export {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
