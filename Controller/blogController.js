const blogSchema = require('../model/blog/blogs')
const cloudinary = require('cloudinary').v2


const createPost = async (req, res, next) => {
    console.log(req.body)
    try {
        const { title, content } = req.body;
        const newPost = new blogSchema({
            title: title,
            content: content,
            // image: req.file.filename // Get the filename from multer
        });

        await newPost.save()
        res.status(200).json({ success: true, message: "Post Created" })

    } catch (error) {
        console.log(error)
        res
            .status(500)
            .json({ success: false, message: "Internal Server Error" })
    }
}

const getPost = async (req, res, next) => {
    try {
        let posts = await blogSchema.find({})
        console.log(posts)
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

module.exports = {
    createPost,
    getPost
}