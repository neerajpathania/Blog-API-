const { default: mongoose } = require("mongoose");
const registerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [false, "Please add an email"],
    },
    password: {
        type: String,
        required: [false, "Please add a password"],
    },
    name: {
        type: String,
        required: [false, "Please add a username"],
    },
    phone: {
        type: mongoose.Schema.Types.Mixed,
        required: [false, "Please add a phone"],
    },
})

module.exports = mongoose.model("Register", registerSchema);
