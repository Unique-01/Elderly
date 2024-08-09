const express = require("express");
const {
    registerUser,
    verifyEmail,
    loginUser,
    refresh,
    resetPasswordRequest,
    resetPassword,
    changePassword,
    socialLoginCallback,
    updateUserNewsInterest,
    updateUserNewsSources,
    userProfile,
    getUsers,
    followUser,
    unfollowUser,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const passport = require("../config/passport-setup");
const fileUpload = require("../middleware/fileUpload");
const router = express.Router();

router.get("/users", getUsers /* #swagger.tags = ['Users'] */);

router.post("/users/register", registerUser /* #swagger.tags = ['Users'] */);
// router.post("/users/verifyEmail", verifyEmail
// /* #swagger.tags = ['Users'] */);
router.post("/users/login", loginUser /* #swagger.tags = ['Users'] */);
router.post("/users/refresh", refresh /* #swagger.tags = ['Users'] */);
// router.post(
//     "/users/forgotPassword",
//     resetPasswordRequest /* #swagger.tags = ['Users'] */
// );
// router.patch(
//     "/users/resetPassword",
//     resetPassword /* #swagger.tags = ['Users'] */
// );
// router.patch(
//     "/users/changePassword",
//     authMiddleware,
//     changePassword /* #swagger.tags = ['Users'] */
// );
router.get(
    "/users/userProfile",
    authMiddleware,
    userProfile /* #swagger.tags = ['Users'] */
);
router.patch(
    "/users/userProfile",
    authMiddleware,
    fileUpload.single("profilePicture"),
    userProfile
    /* 
        #swagger.tags = ['Users'] 
        #swagger.parameters['profilePicture'] = {
            in: 'formData',
            description: 'Profile Picture. Note: Do not test the photo upload Here',
            required: false,
            type: 'file'
        }
    */
);

router.patch(
    "/users/newsInterest",
    authMiddleware,
    updateUserNewsInterest /* #swagger.tags = ['Users'] */
);
router.delete(
    "/users/newsInterest",
    authMiddleware,
    updateUserNewsInterest /* #swagger.tags = ['Users'] */
);
router.patch(
    "/users/newsSources",
    authMiddleware,
    updateUserNewsSources /* #swagger.tags = ['Users'] */
);
router.delete(
    "/users/newsSources",
    authMiddleware,
    updateUserNewsSources /* #swagger.tags = ['Users'] */
);

router.post(
    "/users/follow/:followId",
    authMiddleware,
    followUser /* #swagger.tags = ['Users'] */
);
router.post(
    "/users/unfollow/:unfollowId",
    authMiddleware,
    unfollowUser /* #swagger.tags = ['Users'] */
);

// Google Authentication Routes
router.get(
    "/auth/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    }) /* #swagger.tags = ['Users'] */
);
router.get(
    "/auth/google/callback",
    passport.authenticate("google", { session: false }),
    socialLoginCallback /* #swagger.tags = ['Users'] */
);

module.exports = router;
