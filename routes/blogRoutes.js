const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require('path');

const storage = multer.diskStorage({});

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 10,
    },
});

const {
    createPost,
    getPost,
    deletePost
} = require('../Controller/blogController')

router.post("/createPost", upload.single("image"), createPost)
router.get("/getPost", getPost)
router.delete("/deletePost", deletePost)

module.exports = router;