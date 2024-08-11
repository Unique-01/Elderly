const Notification = require("../models/notificationModel");

const getNotifications = async (req, res) => {
    const userId = req.user._id;
    try {
        const notifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .limit(20);
        res.send(notifications);
    } catch (error) {
        res.status(500).send({ error: "Server Failure" });
    }
};

module.exports = getNotifications