const reviewService = require("../services/review.service")

const addReview = async (req, res) => {

    try {

        const { productId, rating, comment } = req.body;

        const result = await reviewService.addReview(
            req.user.id,
            productId,
            rating,
            comment
        );

        res.status(201).json({
            success: true,
            ...result
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

const getReviews = async (req, res) => {

    try {

        const reviews = await reviewService.getReviews(
            req.params.productId
        );

        res.status(200).json({
            success: true,
            reviews
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

module.exports = {
    addReview,
    getReviews
}