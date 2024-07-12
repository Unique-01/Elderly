const express = require("express");
const {
    registerUser,
    verifyEmail,
    loginUser,
    refresh,
    resetPasswordRequest,
    resetPassword,
    changePassword,
    googleCallback,
} = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");
const passport = require("../passport-setup")

const router = express.Router();

router.post("/users/register", registerUser);
router.post("/users/verifyEmail", verifyEmail);
router.post("/users/login", loginUser);
router.post("/users/refresh", refresh);
router.post("/users/forgotPassword", resetPasswordRequest);
router.patch("/users/resetPassword", resetPassword);
router.patch("/users/changePassword", authMiddleware, changePassword);

router.get("/auth/google",passport.authenticate('google',{scope:['profile','email']}))
router.get("/auth/google/callback",passport.authenticate('google',{session:false}),googleCallback)

module.exports = router;
