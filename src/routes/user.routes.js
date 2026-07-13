const express = require("express");
const auth = require("../middleware/auth.middleware")

const router = express.Router();

const { registerUser, loginUser } = require("../controllers/user.controller");

router.post("/register", registerUser);
router.post("/login", loginUser)
router.get("/profile", auth, async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome User",
        user: req.user
    })
})

module.exports = router;