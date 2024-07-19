const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
    getPrivateMessages,
    getCommunityMessages,
} = require("../controllers/messageController");

const router = express.Router();

router.get(
    "/messages/private/:recipientId",
    authMiddleware,
    getPrivateMessages /* #swagger.tags = ['Messages'] */
);
router.get(
    "/messages/community/:communityId",
    authMiddleware,
    getCommunityMessages /* #swagger.tags = ['Messages'] */
);

module.exports = router;
