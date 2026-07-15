const productService = require("../services/product.service")
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

//create product
// const createProduct = async (req, res) => {
//     try {
//         const product = await productService.createProduct(req.body);

//         return res.status(201).json({

//             success: true,

//             message: "Product Created Successfully",

//             data: product

//         });

//     } catch (err) {
//         return res.status(500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }
const createProduct = async (req, res) => {
    try {

        // Default image array
        let imageUrls = [];

        // Agar image aayi hai
        if (req.file) {

            const result = await new Promise((resolve, reject) => {

                const uploadStream = cloudinary.uploader.upload_stream(

                    {
                        folder: "shopsphere/products"
                    },

                    (error, result) => {

                        if (error) {
                            return reject(error);
                        }

                        resolve(result);

                    }

                );

                streamifier
                    .createReadStream(req.file.buffer)
                    .pipe(uploadStream);

            });

            imageUrls.push(result.secure_url);
        }

        // Image URL body me add kar do
        req.body.images = imageUrls;

        // Product Create
        const product = await productService.createProduct(req.body);
        // console.log(req.body)
        // console.log(req.file)
        // console.log(result)
        // console.log(imageUrls)

        res.status(201).json({

            success: true,

            message: "Product Created Successfully",

            data: product

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }
};

// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
    try {

        // const products = await productService.getAllProducts(); ..it is for all db check
        // const search = req.query.search;
        // const products = await productService.getAllProducts(search);// search a peticular product.
        const { search, featured, stock, minPrice, maxPrice, sort, page, limit } = req.query;
        const products = await productService.getAllProducts( search, featured, stock, minPrice, maxPrice, sort, page, limit)

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