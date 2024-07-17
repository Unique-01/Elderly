const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: false,
        },
        community: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Community",
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

const Post = new mongoose.model("Post", PostSchema);

module.exports = Post;
