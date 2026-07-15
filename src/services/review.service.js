const Review = require("../models/review.model");
const Product = require("../models/product.model");

const addReview = async (userId, productId, rating, comment) => {

    const alreadyReviewed = await Review.findOne({
        user: userId,
        product: productId
    });

    if (alreadyReviewed) {
        throw new Error("You have already reviewed this product");
    }

    await Review.create({
        user: userId,
        product: productId,
        rating,
        comment
    });

    const reviews = await Review.find({ product: productId });

    const numReviews = reviews.length;

    const ratings =
        reviews.reduce((sum, review) => sum + review.rating, 0) /
        numReviews;

    await Product.findByIdAndUpdate(productId, {
        ratings,
        numReviews
    });

    return {
        message: "Review Added Successfully"
    };
};

const getReviews = async (productId) => {

    return await Review.find({
        product: productId
    }).populate("user", "name");

};

module.exports = {
    addReview,
    getReviews
};