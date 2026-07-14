const Product = require("../models/product.model");

// CREATE
const createProduct = async (productData) => {
    return await Product.create(productData);
};

// GET ALL
const getAllProducts = async () => {
    return await Product.find().populate("category");
};

// GET BY ID
const getProductById = async (id) => {
    return await Product.findById(id).populate("category");
};

// UPDATE
const updateProduct = async (id, data) => {
    return await Product.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    }).populate("category");
};

// DELETE
const deleteProduct = async (id) => {
    return await Product.findByIdAndDelete(id);
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
}




// const Product=require("../models/product.model")

// const createProduct= async (productData)=>{

//     const product= await Product .create(productData)
//     return product

// }

// module.exports={createProduct}