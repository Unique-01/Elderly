const express = require("express");
const {
    createCommunity,
    getAllCommunity,
    getUserCommunity,
    getCommunity,
    joinCommunity,
    updateCommunity,
    getCommunityPosts,
    deleteCommunity,
} = require("../controllers/communityController");
const authMiddleware = require("../middleware/authMiddleware");
const fileUpload = require("../middleware/fileUpload");

const router = express.Router();

router.post(
    "/communities",
    authMiddleware,
    fileUpload.single("coverPhoto"),
    createCommunity /* #swagger.tags = ['Community'] */
);
router.get("/communities", getAllCommunity /* #swagger.tags = ['Community'] */);
router.get(
    "/communities/user",
    authMiddleware,
    getUserCommunity /* #swagger.tags = ['Community'] */
);
router.get(
    "/communities/:communityId",
    authMiddleware,
    getCommunity /* #swagger.tags = ['Community'] */
);
router.post(
    "/communities/:communityId/join",
    authMiddleware,
    joinCommunity /* #swagger.tags = ['Community'] */
);
router.patch(
    "/communities/:communityId/update",
    authMiddleware,
    fileUpload.single("coverPhoto"),
    updateCommunity /* #swagger.tags = ['Community'] */
);

router.get(
    "/communities/:communityId/posts",
    authMiddleware,
    getCommunityPosts /* #swagger.tags = ['Community']*/
);
router.delete(
    "/communities/:communityId/delete",
    authMiddleware,
    deleteCommunity /* #swagger.tags = ['Community']*/
);

module.exports = router;
