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

module.exports = { addToCart }