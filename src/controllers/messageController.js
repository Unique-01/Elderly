const Message = require("../models/messageModel");
const Community = require("../models/communityModel");

exports.getPrivateMessages = async (req, res) => {
    const { recipientId } = req.params;
    const userId = req.user._id;

    try {
        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId },
                { senderId: recipientId, recipientId: userId },
            ],
        }).sort({ createdAt: -1 });

        res.send(messages);
    } catch (error) {
        res.status(500).send({ error: "Server Error" });
    }
};

exports.getCommunityMessages = async (req, res) => {
    const { communityId } = req.params;
    const userId = req.user._id;

    try {
        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).send({ error: "Community not found" });
        }
        if (!community.members.includes(userId)) {
            return res.status(403).send("User not in community");
        }
        const messages = await Message.find({ communityId }).sort({
            createdAt: -1,
        });
        res.send(messages);
    } catch (error) {
        res.status(500).send({ error: "Server Error" });
    }
};
