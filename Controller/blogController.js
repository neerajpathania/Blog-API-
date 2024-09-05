const blogSchema = require('../model/blog/blogs')

const createPost = async (req, res, next) => {
    try {
        const { title, content, image } = req.body
        const newPost = new blogSchema({
            title, content, image: req.file.filename
        })

        await newPost.save()
        res.status(200).json({ success: true, message: "Post Created" })

    } catch (error) {
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