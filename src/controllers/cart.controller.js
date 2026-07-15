const cartService = require("../services/cart.service");

const addToCart = async (req, res) => {

    try {

        const { productId } = req.body;

        const userId = req.user.id;

        const cart = await cartService.addToCart(userId, productId);

        res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        })

    }

};
const getCart = async (req, res) => {

    try {

        const cart = await cartService.getCart(req.user.id);

        res.status(200).json({
            success: true,
            cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
const updateQuantity = async (req, res) => {

    try {

        const { quantity } = req.body;

        const { productId } = req.params;

        const cart = await cartService.updateQuantity(
            req.user.id,
            productId,
            quantity
        );

        res.status(200).json({
            success: true,
            message: "Quantity Updated",
            cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
const removeFromCart = async (req, res) => {

    try {

        const cart = await cartService.removeFromCart(
            req.user.id,
            req.params.productId
        );

        res.status(200).json({
            success: true,
            message: "Product Removed",
            cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
const clearCart = async (req, res) => {

    try {

        const cart = await cartService.clearCart(req.user.id);

        res.status(200).json({
            success: true,
            message: "Cart Cleared Successfully",
            cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = { addToCart, getCart, updateQuantity, removeFromCart, clearCart}