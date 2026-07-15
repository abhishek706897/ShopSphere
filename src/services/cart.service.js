const Cart=require("../models/cart.model")

const addToCart = async (userId, productId) => {

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {

        cart = await Cart.create({

            user: userId,

            items: [

                {

                    product: productId,

                    quantity: 1

                }

            ]

        });

        return cart;
    }

    const existingItem = cart.items.find(item =>
        item.product.toString() === productId
    );

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.items.push({

            product: productId,

            quantity: 1

        });

    }

    await cart.save();

    return cart;
};
const getCart = async (userId) => {

    const cart = await Cart.findOne({ user: userId })
        .populate("items.product");

    return cart;

};
const updateQuantity = async (userId, productId, quantity) => {

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        throw new Error("Cart not found");
    }

    const item = cart.items.find(
        item => item.product.toString() === productId.toString()
    );

    if (!item) {
        throw new Error("Product not found in cart");
    }

    item.quantity = quantity;

    await cart.save();

    return cart;
}

const removeFromCart = async (userId, productId) => {

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        throw new Error("Cart not found");
    }

    cart.items = cart.items.filter(
        item => item.product.toString() !== productId.toString()
    );

    await cart.save();

    return cart;
};
const clearCart = async (userId) => {

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        throw new Error("Cart not found");
    }

    cart.items = [];

    await cart.save();

    return cart;
};

module.exports={ addToCart, getCart, updateQuantity, removeFromCart, clearCart }