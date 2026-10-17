const {check, validationResult} = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authController ={

    validateRegister: [
        check("name").not().isEmpty().withMessage("Name is required"),
        check("email").isEmail().withMessage("Email is required"),
        check("email").isEmail().withMessage("Please provide a valid email"),
        check("password").not().isEmpty().withMessage("Password is required"),
        check("password").isLength({min: 6}).withMessage("Password must be at least 6 characters long"),
        check("role").not().isEmpty().withMessage("Role is required"),
    ],
    validateLogin: [
        check("email").not().isEmail().withMessage("Email is required"),
        check("email").isEmail().withMessage("Please provide a valid email"),
        check("password").not().isEmpty().withMessage("Password is required"),
    ],
    register: async (req, res)=>{
        //check if the field is empty
        const {name, email,role, password} = req.body;

        if(!name || !email || !role || !password){
            return res.status(400).json({
                success: false,
                msg: "Please fill in all fields."
            });
        }
        //check if the user already exists
        try{
            const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false, 
                msg: "User already exists."
            });
        }
        //hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            email,
            role,
            password: hashedPassword,
        });
        await newUser.save();
        return res.status(201).json({
            success: true,
            msg: "User registered successfully."
        });
        }catch(error){
            //handle server error
            return res.status(500).json({
                success: false,
                msg: "Internal server error."
            });
        }
    },
    login: async (req, res)=>{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success: false,
                msg: "Please fill in all fields."
            });
        }
        try{
            //check if the user exists
        const existingUser = await User.findOne({email});
        if(!existingUser){
            return res.status(400).json({
                success: false,
                msg: "Invalid credentials."
            });
        }
        //check if the password is correct
        const ispasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if(!ispasswordCorrect){
            return res.status(400).json({
                success: false,
                msg: "Invalid credentials."
            });
        }
        //generate a token
        const token = jwt.sign({id: existingUser._id ,role:existingUser.role}, process.env.JWT_SECRET, {expiresIn: "600h",   
        });
        return res.status(200).json({success: true, token, user: existingUser});
        }
        catch(error){
            //handle server error
            return res.status(500).json({
                success: false,
                msg: "Internal server error."
            });
        }
    },
};

module.exports =authController;