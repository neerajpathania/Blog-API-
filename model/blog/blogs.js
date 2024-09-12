const { default: mongoose } = require("mongoose");
const blogSchema = new mongoose.Schema({
    title: {
        type: String
    },
    content: {
        type: String
    },
    image: {
        type: String
    },
    category: {
        type: String
    }
})
module.exports = mongoose.model("Post", blogSchema)