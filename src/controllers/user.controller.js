const User = require("../models/user.model")
const bcrypt = require("bcrypt")

const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All required fields are mandatory"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone
        });

        res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports={registerUser}