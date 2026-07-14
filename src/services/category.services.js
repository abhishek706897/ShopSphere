const Category = require("../models/category.model");

const createCategory = async (categoryData) => {
    const category = await Category.create(categoryData);
    return category;
};

const getAllCategories = async () => {
    return await Category.find();
};

const getCategoryById = async (id) => {
    return await Category.findById(id);
};

const updateCategory = async (id, data) => {
    return await Category.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
};

const deleteCategory = async (id) => {
    return await Category.findByIdAndDelete(id);
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};