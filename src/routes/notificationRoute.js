const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const getNotifications = require("../controllers/notificationController");

const router = express.Router();

router.get("/notifications", authMiddleware, getNotifications /* #swagger.tags = ['Notification'] */);

module.exports = router;
