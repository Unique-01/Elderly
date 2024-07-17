const express = require("express");
const {
    createPost,
    getAllPost,
    getUserPosts,
    getPost,
    updatePost,
    deletePost,
} = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/posts", authMiddleware, createPost /* #swagger.tags = ['Post']*/);
router.get("/posts", authMiddleware, getAllPost /* #swagger.tags = ['Post']*/);

router.get(
    "/posts/user",
    authMiddleware,
    getUserPosts /* #swagger.tags = ['Post']*/
);
router.get(
    "/posts/:postId",
    authMiddleware,
    getPost /* #swagger.tags = ['Post']*/
);
router.patch(
    "/posts/:postId/update",
    authMiddleware,
    updatePost /* #swagger.tags = ['Post']*/
);
router.delete(
    "/posts/:postId/delete",
    authMiddleware,
    deletePost /* #swagger.tags = ['Post']*/
);

module.exports = router;
