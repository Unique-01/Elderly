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
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const passport = require("../passport-setup");

const router = express.Router();

router.post("/users/register", registerUser /* #swagger.tags = ['Users'] */);
router.post("/users/verifyEmail", verifyEmail /* #swagger.tags = ['Users'] */);
router.post("/users/login", loginUser /* #swagger.tags = ['Users'] */);
router.post("/users/refresh", refresh /* #swagger.tags = ['Users'] */);
router.post(
    "/users/forgotPassword",
    resetPasswordRequest /* #swagger.tags = ['Users'] */
);
router.patch(
    "/users/resetPassword",
    resetPassword /* #swagger.tags = ['Users'] */
);
router.patch(
    "/users/changePassword",
    authMiddleware,
    changePassword /* #swagger.tags = ['Users'] */
);
router.get(
    "/users/userProfile",
    authMiddleware,
    userProfile /* #swagger.tags = ['Users'] */
);
router.patch(
    "/users/userProfile",
    authMiddleware,
    userProfile /* #swagger.tags = ['Users'] */
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
