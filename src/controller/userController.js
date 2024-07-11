const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const sendEmailCode = require("../utils/sendEmailCode");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
        return res.status(400).send({ error: "Email is Already Registered" });
    }
    const user = new User(req.body);

    const verificationCode = await sendEmailCode(
        user.email,
        "Verify Email",
        "Your email verification code"
    );

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = Date.now() + 3600000;

    try {
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

const verifyEmail = async (req, res) => {
    const { email, verificationCode } = req.body;
    try {
        const user = await User.findOne({
            email,
            verificationCode: verificationCode,
            verificationCodeExpires: { $gt: Date.now() },
        });
        if (!user)
            return res
                .status(400)
                .send({ message: "Invalid or expired verification code" });

        user.verified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;

        await user.save();
        res.status(200).send({ message: "Email verified successfully" });
    } catch (error) {
        res.status(500).send(error);
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send({ error: "Invalid email or password" });
        }

        if (!user.verified) {
            return res.status(403).send({ message: "Email not verified" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).send({ error: "Invalid email or password" });
        }

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        return res.send({ accessToken, refreshToken });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Internal server error" });
    }
};

const refresh = async (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return res.status(400).send({ error: "Missing refresh token" });
    }
    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );
        const user = await User.findOne({ _id: decoded._id });

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).send({ error: "Invalid refresh token" });
        }

        const accessToken = await user.generateAccessToken();

        res.send({ accessToken });
    } catch (error) {
        res.status(403).send();
    }
};

const resetPasswordRequest = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            const verificationCode = await sendEmailCode(
                user.email,
                "Reset Password",
                "Your password reset verification code"
            );
            user.verificationCode = verificationCode;
            user.verificationCodeExpires = Date.now() + 3600000;
            await user.save();
        }
        res.send({ message: "Password reset code has been sent Successfully" });
    } catch (error) {
        res.status(400).send();
    }
};

const resetPassword = async (req, res) => {
    const { email, verificationCode, newPassword } = req.body;
    try {
        const user = await User.findOne({
            email,
            verificationCode: verificationCode,
            verificationCodeExpires: { $gt: Date.now() },
        });
        if (!user)
            return res
                .status(400)
                .json({ error: "Invalid or expired reset code" });

        user.password = newPassword;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        user.refreshToken = undefined

        await user.save();

        res.send({ message: "Password reset Successfully" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    verifyEmail,
    refresh,
    resetPasswordRequest,
    resetPassword,
};
