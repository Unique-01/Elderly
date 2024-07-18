const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
    createComment,
    getComment,
    updateComment,
    deleteComment,
} = require("../controllers/commentController");

const router = express.Router();

router.post(
    "/comments",
    authMiddleware,
    createComment /* #swagger.tags = ['Comment'] */
);
router.get(
    "/comments/:commentId",
    authMiddleware,
    getComment /* #swagger.tags = ['Comment'] */
);
router.patch(
    "/comments/:commentId/update",
    authMiddleware,
    updateComment /* #swagger.tags = ['Comment'] */
);
router.delete(
    "/comments/:commentId/delete",
    authMiddleware,
    deleteComment /* #swagger.tags = ['Comment'] */
);

module.exports = router;
