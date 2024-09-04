const UserRegister = require("../../model/auth/register");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserLogin = require("../../model/auth/login");

const multer = require("multer");
const upload = multer(); // Configure multer if needed




// const nodemailer = require("nodemailer");
// const cloudinary = require("cloudinary").v2;

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     port: "587",
//     auth: {
//         user: "testingdvtesting@gmail.com",
//         pass: "socp dqcb pbrh gwul",
//     },
//     secureConnection: "false",
//     tls: {
//         ciphers: "SSLv3",
//         rejectUnauthorized: false,
//     },
// });

// cloudinary.config({
//     cloud_name: "djtsjuqyi",
//     api_key: "225368946457134",
//     api_secret: "iGO_xUkipR8D_7a2M6ht7bs3IrA",
// });

// const fs = require("fs");

// generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

const registerUser = async (req, res, next) => {
    console.log("Received request body:", req.body);
    try {
        const {
            email,
            password,
            name,
            phoneNumber,
        } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Please add all fields" });
        }

        const userExists = await UserRegister.findOne({ email });
        if (userExists) {
            res
                .status(400)
                .json({ success: false, message: "User already exists" });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            //  const hashedConfirmPassword = await bcrypt.hash(confirmPassword, 10);
            const newUser = new UserRegister({
                email,
                password: hashedPassword,
                name,
                phone: phoneNumber,
            });
            const user = await newUser.save();
            if (user) {
                return res
                    .status(200)
                    .json({
                        success: true,
                        message: "User Registered Successfully",
                        data: user,
                        _id: user._id,
                        token: generateToken(user._id),
                        message: "User Registered Successfully",
                        redirect: "Dashboard",
                    });
            } else {
                res
                    .status(400)
                    .json({ success: false, message: "something went Wrong" });
                throw new Error("Invalid user data");
            }
        }
    } catch (error) {
        next(error);
        res
            .status(500)
            .json({ success: true, message: "Internal Server Error", error: error });
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await UserRegister.findOne({ email });

        if (user && user.deactivated) {
            return res.status(403).json({ message: "Account is deactivated. Please contact support." });
        }

        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(200).json({
                data: user,
                _id: user._id,
                token: generateToken(user._id),
                message: "Login successful",
            });
        } else {
            res.status(400).json({ message: "Invalid credentials" }); // Respond with 400 for invalid credentials
        }
    } catch (error) {
        next(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    registerUser,
    loginUser,
}