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
    addUserNewsInterest,
    removeUserNewsInterest,
    addUserNewsSources,
    removeUserNewsSources,
} = require("../controller/userController");
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
router.post(
    "/users/newsInterest",
    authMiddleware,
    addUserNewsInterest /* #swagger.tags = ['Users'] */
);
router.delete(
    "/users/newsInterest",
    authMiddleware,
    removeUserNewsInterest /* #swagger.tags = ['Users'] */
);
router.post(
    "/users/newsSources",
    authMiddleware,
    addUserNewsSources /* #swagger.tags = ['Users'] */
);
router.delete(
    "/users/newsSources",
    authMiddleware,
    removeUserNewsSources /* #swagger.tags = ['Users'] */
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
