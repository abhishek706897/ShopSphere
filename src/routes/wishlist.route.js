const express = require("express");
const router = express.Router();

const wishlistController = require("../controllers/wishlist.controller");
const verifyToken = require("../middleware/auth.middleware");

router.post("/", verifyToken, wishlistController.addToWishlist );
router.get("/", verifyToken, wishlistController.getWishlist );
router.delete("/:productId", verifyToken, wishlistController.removeFromWishlist );
router.delete("/", verifyToken, wishlistController.clearWishlist);

module.exports=router