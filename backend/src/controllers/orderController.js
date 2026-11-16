
import {
  Order,
  Cart,
  Product,
  Address,
} from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";

// Create Order
const createOrder = asyncHandler(async (req, res) => {
  const { addressId, paymentMethod } = req.body;

  if (!addressId || !["cod", "online"].includes(paymentMethod)) {
    res.status(400);
    throw new Error("Valid address and payment method are required");
  }

  const address = await Address.findOne({
    _id: addressId,
    user: req.user._id,
  });

  if (!address) {
    res.status(404);
    throw new Error("Delivery address not found");
  }

  const cart = await Cart.findOne({
    user: req.user._id,
  }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("Your cart is empty");
  }

  let totalAmount = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const product = item.product;

    if (!product || !product.isActive) {
      res.status(400);
      throw new Error("A product in your cart is unavailable");
    }

    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    });

    totalAmount += product.price * item.quantity;
  }

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    totalAmount,
    shippingAddress: {
      fullName: address.fullName,
      phone: address.phone,
      addressLine: address.addressLine,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    },
    paymentMethod,
  });

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    order,
  });
});

// Get My Orders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
  })
    .populate("items.product", "name images")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

// Get Order By ID
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id,
  }).populate("items.product", "name images");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.status(200).json({
    success: true,
    order,
  });
});

export {
  createOrder,
  getMyOrders,
  getOrderById,
};
