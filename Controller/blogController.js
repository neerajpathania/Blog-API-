const blogSchema = require('../model/blog/blogs')
const cloudinary = require('cloudinary').v2
const UserRegister = require("../model/auth/register");


const createPost = async (req, res, next) => {
    console.log(req.body)
    try {
        const { title, content, userId } = req.body;
        const newPost = new blogSchema({
            title: title,
            content: content,
            // image: req.file.filename // Get the filename from multer
        });

        const savedPost = await newPost.save()
        // Update the user's posts field
        await UserRegister.findByIdAndUpdate(
            userId,
            { $push: { posts: savedPost } },
            { new: true }
        );


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
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

const deletePost = async (req, res, next) => {
    try {
        const { blogId, userId } = req.query
        const postToDelete = await blogSchema.findByIdAndDelete(blogId)

        if (!postToDelete) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Step 2: Manually remove the post from the user's posts array
        const user = await UserRegister.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Filter out the post from the posts array
        user.posts = user.posts.filter(post => post._id.toString() !== blogId);

        // Save the updated user document
        await user.save();

        // Return success response
        res.status(200).json({ success: true, message: "Post deleted successfully" });

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

module.exports = {
    createPost,
    getPost,
    deletePost
}