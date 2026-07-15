const wishlistService=require("../services/wishlist.service")

const addToWishlist = async (req, res) => {

    try {

        const { productId } = req.body;

        const wishlist = await wishlistService.addToWishlist(
            req.user.id,
            productId
        );

        res.status(200).json({
            success: true,
            message: "Product added to wishlist",
            wishlist
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getWishlist = async (req, res) => {

    try {

        const wishlist = await wishlistService.getWishlist(req.user.id);

        res.status(200).json({
            success: true,
            wishlist
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const clearWishlist = async (req, res) => {

    try {

        const wishlist = await wishlistService.clearWishlist(req.user.id);

        res.status(200).json({
            success: true,
            message: "Wishlist cleared",
            wishlist
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
const removeFromWishlist = async (req, res) => {

    try {

        const wishlist = await wishlistService.removeFromWishlist(
            req.user.id,
            req.params.productId
        );

        res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
            wishlist
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
    clearWishlist
};

