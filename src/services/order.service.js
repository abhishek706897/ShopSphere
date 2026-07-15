const Order = require("../models/order.model");
const Cart = require("../models/cart.model");

const placeOrder = async (userId, shippingAddress) => {

    const cart = await Cart.findOne({ user: userId })
        .populate("items.product");

    if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
    }

    const products = cart.items.map(item => ({

        product: item.product._id,

        quantity: item.quantity,

        price: item.product.discountPrice || item.product.price

    }));

    const totalAmount = products.reduce(

        (total, item) => total + item.price * item.quantity,

        0

    );

    const order = await Order.create({

        user: userId,

        products,

        totalAmount,

        shippingAddress

    });

    cart.items = [];

    await cart.save();

    return order;

};

const getMyOrders = async (userId) => {

    return await Order.find({ user: userId })
        .populate("products.product");

};

const getSingleOrder = async (orderId) => {

    return await Order.findById(orderId)
        .populate("products.product");

};

const updateOrderStatus = async (orderId, orderStatus) => {

    const order = await Order.findById(orderId);

    if (!order) {
        throw new Error("Order not found");
    }

    order.orderStatus = orderStatus;

    await order.save();

    return order;

};

module.exports = {
    placeOrder,
    getMyOrders,
    getSingleOrder,
    updateOrderStatus
};