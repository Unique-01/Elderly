const Post = require("../models/postModel");
const Community = require("../models/communityModel");
const Comment = require("../models/commentModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel")

// const createPost = async (req, res) => {
//     /*
//     #swagger.parameters['image'] = {
//             in: 'formData',
//             description: 'Post Image. Note: Do not test the photo upload Here',
//             required: false,
//             type: 'file'
//     }
//     */
//     const { content, communityId } = req.body;
//     const image = req.file ? `/uploads/${req.file.filename}` : "";
//     const author = req.user._id;
//     try {
//         const community = await Community.findById(communityId);
//         if (!community) {
//             return res.status(404).send({ error: "Community not found" });
//         }

//         if (!community.members.includes(author)) {
//             return res.status(403).send("User not in community");
//         }
//         const post = new Post({
//             content,
//             author,
//             image,
//             community: communityId,
//         });
//         await post.save();
//         community.posts.push(post._id);
//         await community.save();
//         res.status(201).send(post);
//     } catch (error) {
//         res.status(400).send({ error: error.message });
//     }
// };

const createPost = async (req, res) => {
    /*
    #swagger.parameters['image'] = {
            in: 'formData',
            description: 'Post Image. Note: Do not test the photo upload Here',
            required: false,
            type: 'file'
    }
    */
    const { content, communityId } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";
    const author = req.user._id;

    try {
        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).send({ error: "Community not found" });
        }

        if (!community.members.includes(author)) {
            return res.status(403).send("User not in community");
        }

        // Create the post
        const post = new Post({
            content,
            author,
            image,
            community: communityId,
        });

        await post.save();

        // Add post to community
        community.posts.push(post._id);
        await community.save();

        // Notification Logic
        const communityMemberIds = community.members.map((member) =>
            member.toString()
        );

        // Find the author's followers (IDs only)
        const authorDoc = await User.findById(author, "followers username");
        const followerIds = authorDoc.followers.map((follower) =>
            follower.toString()
        );

        // Combine community members and followers, avoiding duplicates
        const uniqueRecipients = new Set([
            ...communityMemberIds,
            ...followerIds,
        ]);

        const notifications = [];
        uniqueRecipients.forEach((recipientId) => {
            notifications.push({
                recipient: recipientId,
                notificationType: "post",
                message: `${authorDoc.username} created a new post in ${community.name}.`,
                postId: post._id, // Optional: Link to the post
            });
        });

        // Save all notifications
        await Notification.insertMany(notifications);

        res.status(201).send(post);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const getAllPost = async (req, res) => {
    try {
        const post = await Post.find()
            .populate("community", "name")
            .populate("author", "username");

        res.send(post);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const getPost = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findOne({ _id: postId });
        if (!post) {
            return res.status(404).send({ error: "Post not found" });
        }
        res.send(post);
    } catch (error) {
        res.status(500).send({ error: "server error" });
    }
};

const getUserPosts = async (req, res) => {
    const userId = req.user._id;
    try {
        const posts = await Post.find({ author: userId });
        res.send(posts);
    } catch (error) {
        res.status(500).send({ error: "server failure" });
    }
};

const updatePost = async (req, res) => {
    /*
    #swagger.parameters['image'] = {
            in: 'formData',
            description: 'Post Image. Note: Do not test the photo upload Here',
            required: false,
            type: 'file'
    }
    */
    const { postId } = req.params;
    const userId = req.user._id;
    const { content } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send({ error: "Post not found" });
        }
        if (post.author.toString() !== userId.toString()) {
            return res.status(403).send({
                error: "You don't have permission to update this post",
            });
        }
        post.content = content;
        if (image) {
            post.image = image;
        }
        await post.save();
        res.send(post);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const deletePost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user._id;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send({ error: "Post not found" });
        }
        if (post.author.toString() !== userId.toString()) {
            return res.status(403).send({ error: "Permission denied" });
        }

        await Post.deleteOne({ _id: postId });

        res.send({ message: "Post deleted successfully", post });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const getPostComments = async (req, res) => {
    const { postId } = req.params;
    try {
        const comments = Comment.find({ postId });
        res.send(comments);
    } catch (error) {
        res.status(500).send({ error: "Server Error" });
    }
};

const likePost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user._id;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).send({ error: "Post not found" });
        }
        if (post.likes.includes(userId)) {
            return res
                .status(400)
                .send({ error: "You have already liked this post" });
        }

        post.likes.push(userId);
        const notification = new Notification({
            recipient: post.author._id,
            notificationType: 'like',
            message: `${req.user.username} liked your post.`,
          });
      
          await notification.save();
        await post.save();
        res.send({ message: "Post liked successfully" });
    } catch (error) {
        res.status(500).send({ error: "Server Error" });
    }
};

const unlikePost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user._id;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).send({ error: "Post not found" });
        }
        if (!post.likes.includes(userId)) {
            return res
                .status(400)
                .send({ error: "You have not liked this post" });
        }

        post.likes.pull(userId);
        await post.save();
        res.send({ message: "Post unlike successfully" });
    } catch (error) {
        res.status(500).send({ error: "Server Error" });
    }
};
module.exports = {
    createPost,
    getAllPost,
    getPost,
    getUserPosts,
    updatePost,
    deletePost,
    getPostComments,
    likePost,
    unlikePost,
};
