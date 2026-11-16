
import { Product } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";

// Get All Products
const getProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    category,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 12,
  } = req.query;

  const filter = { isActive: true };

  if (keyword) {
    filter.$text = { $search: keyword };
  }

  if (category) {
    filter.category = category;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};

    if (minPrice !== undefined) {
      filter.price.$gte = Number(minPrice);
    }

    if (maxPrice !== undefined) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  const sortOptions = {
    newest: { createdAt: -1 },
    priceLow: { price: 1 },
    priceHigh: { price: -1 },
    rating: { "ratings.average": -1 },
  };

  const sortBy = sortOptions[sort] || { createdAt: -1 };

  const pageNumber = Math.max(1, Number(page) || 1);
  const limitNumber = Math.min(50, Math.max(1, Number(limit) || 12));
  const skip = (pageNumber - 1) * limitNumber;

  const [products, totalProducts] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort(sortBy)
      .skip(skip)
      .limit(limitNumber),

    Product.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: products.length,
    totalProducts,
    currentPage: pageNumber,
    totalPages: Math.ceil(totalProducts / limitNumber),
    products,
  });
});

// Get Single Product
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    isActive: true,
  }).populate("category", "name slug");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Create Product
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    description,
    price,
    originalPrice,
    category,
    brand,
    images,
    stock,
  } = req.body;

  if (
    !name ||
    !slug ||
    !description ||
    price === undefined ||
    originalPrice === undefined ||
    !category ||
    stock === undefined
  ) {
    res.status(400);
    throw new Error("Please provide all required product fields");
  }

  const product = await Product.create({
    name,
    slug,
    description,
    price,
    originalPrice,
    category,
    brand,
    images,
    stock,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const allowedFields = [
    "name",
    "slug",
    "description",
    "price",
    "originalPrice",
    "category",
    "brand",
    "images",
    "stock",
    "featured",
    "trending",
    "isActive",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  const updatedProduct = await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product: updatedProduct,
  });
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.isActive = false;
  await product.save();

  res.status(200).json({
    success: true,
    message: "Product deactivated successfully",
  });
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
