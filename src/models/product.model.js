const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
        },

        brand: {
            type: String,
            required: true,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
        },

        discountPrice: {
            type: Number,
            default: 0,
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        images: [
            {
                type: String,
            },
        ],

        stock: {
            type: Number,
            default: 0,
        },

        sold: {
            type: Number,
            default: 0,
        },

        ratings: {
            type: Number,
            default: 0,
        },

        numReviews: {
            type: Number,
            default: 0,
        },

        isFeatured: {
            type: Boolean,
            default: false,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
)

module.exports=mongoose.model("Product",productSchema)