const express = require("express");
const {
    registerUser,
    verifyEmail,
    loginUser,
    refresh,
    resetPasswordRequest,
    resetPassword,
} = require("../controller/userController");

const router = express.Router();

router.post("/users/register", registerUser);
router.post("/users/verifyEmail", verifyEmail);
router.post("/users/login", loginUser);
router.post("/users/refresh", refresh);
router.post("/users/forgotPassword", resetPasswordRequest);
router.patch("/users/resetPassword", resetPassword);

module.exports = router;
