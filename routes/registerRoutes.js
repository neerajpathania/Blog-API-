const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer(); // Configure multer if needed
const {
    registerUser,
    loginUser,
} = require('../Controller/auth/userController')

router.post("/signup", upload.none(), registerUser)
router.post("/signin", loginUser);

module.exports = router;