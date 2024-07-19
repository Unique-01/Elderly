const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        communityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Community",
        },
        message: {
            type: String,
        },
    },
    { timestamps: true }
);

const Message = new mongoose.model("Message", messageSchema);

module.exports = Message;
