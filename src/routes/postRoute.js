const express = require("express");
const {
    createPost,
    getAllPost,
    getUserPosts,
    getPost,
    updatePost,
    deletePost,
    getPostComments,
} = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const fileUpload = require("../middleware/fileUpload");

const router = express.Router();

router.post(
    "/posts",
    authMiddleware,
    fileUpload.single("image"),
    createPost /* #swagger.tags = ['Post']*/
);
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
router.get(
    "/posts/:postId/comments",
    authMiddleware,
    getPostComments /* #swagger.tags = ['Post']*/
);
router.patch(
    "/posts/:postId/update",
    authMiddleware,
    fileUpload.single("image"),
    updatePost /* #swagger.tags = ['Post']*/
);
router.delete(
    "/posts/:postId/delete",
    authMiddleware,
    deletePost /* #swagger.tags = ['Post']*/
);

module.exports = router;
