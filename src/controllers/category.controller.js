const categoryService = require("../services/category.services");

const createCategory = async (req, res) => {
    try {
        const category = await categoryService.createCategory(req.body);

        res.status(201).json({
            success: true,
            message: "Category Created Successfully",
            data: category,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();

        res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category Not Found",
            });
        }

        res.status(200).json({
            success: true,
            data: category,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const category = await categoryService.updateCategory(
            req.params.id,
            req.body
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category Not Found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Category Updated Successfully",
            data: category,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await categoryService.deleteCategory(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category Not Found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Category Deleted Successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};