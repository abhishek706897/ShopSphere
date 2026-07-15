const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");
const verifyToken = require("../middleware/auth.middleware");

router.post("/", verifyToken, orderController.placeOrder);

router.get("/", verifyToken, orderController.getMyOrders);

router.get("/:id", verifyToken, orderController.getSingleOrder);

router.patch("/:id", verifyToken, orderController.updateOrderStatus);

module.exports = router