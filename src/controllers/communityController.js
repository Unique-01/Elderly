const Community = require("../models/communityModel");
const Post = require("../models/postModel");

const createCommunity = async (req, res) => {
    /*
    #swagger.parameters['coverPhoto'] = {
            in: 'formData',
            description: 'Cover Photo. Note: Do not test the photo upload Here',
            required: false,
            type: 'file'
    }
    */
    const { name, description } = req.body;
    const coverPhoto = req.file ? `/uploads/${req.file.filename}` : "";
    const admin = req.user._id;
    try {
        const community = new Community({ name, description, coverPhoto });
        community.admin = admin;
        community.members.push(admin);
        await community.save();

        res.status(201).send(community);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const getAllCommunity = async (req, res) => {
    // #swagger.description = "Endpoint to get all available communities"
    try {
        const communities = await Community.find().populate(
            "members",
            "username"
        );
        if (!communities) {
            return res.status(404).send({ error: "No community found" });
        }
        res.send(communities);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const getUserCommunity = async (req, res) => {
    // #swagger.description = "Endpoint to get User communities"
    const userId = req.user._id;
    try {
        const communities = await Community.find({ members: userId }).populate(
            "members",
            "username"
        );
        if (!communities) {
            return res.status(404).send({ error: "No communities found" });
        }
        res.send(communities);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const getCommunity = async (req, res) => {
    const { communityId } = req.params;
    try {
        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).send({ error: "Community not found" });
        }
        res.send(community);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const joinCommunity = async (req, res) => {
    const { communityId } = req.params;
    const userId = req.user._id;
    try {
        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).send({ error: "Community not found" });
        }
        community.members.push(userId);
        res.send({ message: "Community joined" });

        await community.save()
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
const updateCommunity = async (req, res) => {
    /*
    #swagger.parameters['coverPhoto'] = {
            in: 'formData',
            description: 'Cover Photo. Note: Do not test the photo upload Here',
            required: false,
            type: 'file'
    }
    */
    const { communityId } = req.params;
    const { name, description } = req.body;
    const coverPhoto = req.file ? `/uploads/${req.file.filename}` : "";
    const admin = req.user._id;

    try {
        const community = await Community.findOneAndUpdate(
            { _id: communityId, admin: admin },
            { name, description, coverPhoto },
            { new: true }
        );
        if (!community) {
            return res.status(404).send({ error: "Community not found" });
        }
        res.send(community);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const getCommunityPosts = async (req, res) => {
    const { communityId } = req.params;
    try {
        const posts = await Post.find({ community: communityId }).populate(
            "author",
            "username fullName profilePicture"
        );
        res.send(posts);
    } catch (error) {
        res.status(500).send({ error: "Server Error" });
    }
};
const deleteCommunity = async (req, res) => {
    const { communityId } = req.params;
    const userId = req.user._id;
    try {
        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).send({ error: "Community not found" });
        }
        if (community.author.toString() !== userId.toString()) {
            return res.status(403).send({ error: "Permission denied" });
        }
        await Community.deleteOne({ _id: communityId });
        res.sent({ message: "Community deleted successfully", community });
    } catch (error) {
        res.status(500).send({ error: "Server Failure" });
    }
};
module.exports = {
    createCommunity,
    getAllCommunity,
    getUserCommunity,
    getCommunity,
    joinCommunity,
    updateCommunity,
    getCommunityPosts,
    deleteCommunity
};
