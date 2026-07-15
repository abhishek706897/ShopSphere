const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cart.controller")
const verifyToken = require("../middleware/auth.middleware")

router.post( "/", verifyToken, cartController.addToCart)
module.exports = router