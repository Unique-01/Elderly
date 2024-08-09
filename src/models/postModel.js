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
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

PostSchema.index({ likes: 1 });
const Post = new mongoose.model("Post", PostSchema);

module.exports = Post;
