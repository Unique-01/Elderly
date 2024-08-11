const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        notificationType: {
            type: String,
        }, // 'post', 'comment', 'like', 'follow'
        message: {
            type: String,
        },
    },
    { timestamps: true }
);

const Notification = new mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
