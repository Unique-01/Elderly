const Comment = require("../models/commentModel");
const Post = require("../models/postModel");
const Notification = require("../models/notificationModel");

exports.createComment = async (req, res) => {
    const { content, postId } = req.body;
    const userId = req.user._id;

    try {
        const post = await Post.findById(postId).populate("author");
        if (!post) {
            return res.status(404).send({ error: "Post not found" });
        }
        const comment = new Comment({ content, postId, author: userId });
        await comment.save();
        post.comments.push(comment._id);
        await post.save();
        const notification = new Notification({
            recipient: post.author._id,
            notificationType: "comment",
            message: `${comment.author.username} commented on your post.`,
        });

        await notification.save();
        res.status(201).send(comment);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.getComment = async (req, res) => {
    const { commentId } = req.params;
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).send({ error: "Comment not found" });
        }
        res.send(comment);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.updateComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;
    const { content } = req.body;
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).send({ error: "Comment not found" });
        }
        if (comment.author.toString() !== userId.toString()) {
            return res.status(403).send({ error: "Permission denied" });
        }
        comment.content = content;
        await comment.save();

        res.send(comment);
    } catch (error) {
        res.status(500).send({ error: "Server Error" });
    }
};

exports.deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.send({ error: "Comment not found" });
        }
        if (comment.author.toString() !== userId.toString()) {
            return rs.status(403).send({ error: "Permission denied" });
        }
        await Comment.deleteOne({ _id: commentId });
        res.send({ message: "Comment deleted Successfully", comment });
    } catch (error) {
        res.status(500).send({ error: "Server Error" });
    }
};
