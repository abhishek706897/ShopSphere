const orderService = require("../services/order.service")

const placeOrder = async (req, res) => {

    try {

        const { shippingAddress } = req.body;

        const order = await orderService.placeOrder(
            req.user.id,
            shippingAddress
        );

        res.status(201).json({
            success: true,
            message: "Order Placed Successfully",
            order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getMyOrders = async (req, res) => {

    try {

        const orders = await orderService.getMyOrders(req.user.id);

        res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getSingleOrder = async (req, res) => {

    try {

        const order = await orderService.getSingleOrder(req.params.id);

        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const updateOrderStatus = async (req, res) => {

    try {

        const order = await orderService.updateOrderStatus(
            req.params.id,
            req.body.orderStatus
        );

        res.status(200).json({
            success: true,
            message: "Order Status Updated",
            order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    placeOrder,
    getMyOrders,
    getSingleOrder,
    updateOrderStatus
};