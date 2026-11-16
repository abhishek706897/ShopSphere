
import { Category } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";

// Get All Active Categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({
    name: 1,
  });

  res.status(200).json({
    success: true,
    count: categories.length,
    categories,
  });
});

// Get Single Category
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findOne({
    _id: req.params.id,
    isActive: true,
  });

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.status(200).json({
    success: true,
    category,
  });
});

// Create Category
const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, description, image } = req.body;

  if (!name || !slug) {
    res.status(400);
    throw new Error("Category name and slug are required");
  }

  const category = await Category.create({
    name,
    slug,
    description,
    image,
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    category,
  });
});

// Update Category
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const { name, slug, description, image, isActive } = req.body;

  if (name !== undefined) category.name = name;
  if (slug !== undefined) category.slug = slug;
  if (description !== undefined) category.description = description;
  if (image !== undefined) category.image = image;
  if (isActive !== undefined) category.isActive = isActive;

  const updatedCategory = await category.save();

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    category: updatedCategory,
  });
});

// Delete Category
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  category.isActive = false;
  await category.save();

  res.status(200).json({
    success: true,
    message: "Category deactivated successfully",
  });
});

export {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
