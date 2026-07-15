const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cart.controller")
const verifyToken = require("../middleware/auth.middleware")

router.post( "/", verifyToken, cartController.addToCart)
router.get("/", verifyToken, cartController.getCart)
router.put("/:productId", verifyToken, cartController.updateQuantity )
router.delete("/:productId", verifyToken, cartController.removeFromCart)
router.delete( "/", verifyToken, cartController.clearCart);
module.exports = router