const productService = require("../services/product.service")

//create product
const createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body);

        return res.status(201).json({

            success: true,

            message: "Product Created Successfully",

            data: product

        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
    try {

        // const products = await productService.getAllProducts(); ..it is for all db check
        // const search = req.query.search;
        // const products = await productService.getAllProducts(search);// search a peticular product.
        const { search, featured, stock, minPrice, maxPrice } = req.query;
        const products = await productService.getAllProducts( search, featured, stock, minPrice, maxPrice)

        return res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// GET PRODUCT BY ID
const getProductById = async (req, res) => {
    try {

        const product = await productService.getProductById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            });
        }

        return res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
    try {

        const product = await productService.updateProduct(
            req.params.id,
            req.body
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product Updated Successfully",
            data: product
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {

        const product = await productService.deleteProduct(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product Deleted Successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct

}