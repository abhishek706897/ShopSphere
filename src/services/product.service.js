const Product = require("../models/product.model");

// CREATE
const createProduct = async (productData) => {
    return await Product.create(productData);
};

// GET ALL
// const getAllProducts = async () => {
//     return await Product.find().populate("category")

//         .populate("category", "name slug")

//         .populate("createdBy", "name email");

// };
// get product by search name
//  const getAllProducts = async (search) => {

//     let filter = {};

//     if(search){

//         filter.name = {

//             $regex:search,

//             $options:"i"

//         }

//     }

//     return await Product.find(filter)

//     .populate("category","name slug");
//}

// get  product by filter
const getAllProducts = async (
    search,
    featured,
    stock,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 10
) => {

    let filter = {};

    // Search
    if (search) {
        filter.name = {
            $regex: search,
            $options: "i",
        };
    }

    // Featured Products
    if (featured === "true") {
        filter.isFeatured = true;
    }

    // Stock Available
    if (stock === "true") {
        filter.stock = {
            $gt: 0,
        };
    }

    // Price Filter
    if (minPrice || maxPrice) {

        filter.price = {};

        if (minPrice) {
            filter.price.$gte = Number(minPrice);
        }

        if (maxPrice) {
            filter.price.$lte = Number(maxPrice);
        }
    }
    let sortOption = { createdAt: -1 };

    if (sort) {

        switch (sort) {

            case "price":
                sortOption = { price: 1 };
                break;

            case "-price":
                sortOption = { price: -1 };
                break;

            case "newest":
                sortOption = { createdAt: -1 };
                break;

            case "oldest":
                sortOption = { createdAt: 1 };
                break;

            default:
                sortOption = { createdAt: -1 };
        }

    }

    return await Product.find(filter)
        .populate("category", "name slug")
        .sort(sortOption)
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