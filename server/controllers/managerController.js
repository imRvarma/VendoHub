const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const managerController = {

    validateLogin: [
        check("email").not().isEmpty().withMessage("Email is required"),
        check("email").isEmail().withMessage("Please provide a valid email"),
        check("password").not().isEmpty().withMessage("Password is required"),
    ],

    login: async (req, res) => {
        // Check validation results
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            // Check if user exists
            const existingUser = await User.findOne({ email });
            if (!existingUser) {
                return res.status(400).json({
                    success: false,
                    msg: "Invalid credentials.",
                });
            }

            // Ensure the account has the manager role
            if (existingUser.role !== "manager") {
                return res.status(403).json({
                    success: false,
                    msg: "Access denied. This endpoint is for managers only.",
                });
            }

            // Verify password
            const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({
                    success: false,
                    msg: "Invalid credentials.",
                });
            }

            // Generate JWT
            const token = jwt.sign(
                { id: existingUser._id, role: existingUser.role },
                process.env.JWT_SECRET,
                { expiresIn: "600h" }
            );

            return res.status(200).json({
                success: true,
                token,
                user: existingUser,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                msg: "Internal server error.",
            });
        }
    },

    validateRegister: [
        check("name").not().isEmpty().withMessage("Name is required"),
        check("email").not().isEmpty().withMessage("Email is required"),
        check("email").isEmail().withMessage("Please provide a valid email"),
        check("password").not().isEmpty().withMessage("Password is required"),
        check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    ],

    register: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    msg: "User already exists.",
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                name,
                email,
                role: "manager",
                password: hashedPassword,
            });
            await newUser.save();

            return res.status(201).json({
                success: true,
                msg: "Manager registered successfully.",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                msg: "Internal server error.",
            });
        }
    },
};

module.exports = managerController;
