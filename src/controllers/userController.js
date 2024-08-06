const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const sendEmailCode = require("../utils/sendEmailCode");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    const { email, phoneNumber, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).send({ error: "Email is Already Registered" });
    }
    const user = new User({ email, phoneNumber, password });

    // const verificationCode = await sendEmailCode(
    //     user.email,
    //     "Verify Email",
    //     "Your email verification code"
    // );

    // user.verificationCode = verificationCode;
    // user.verificationCodeExpires = Date.now() + 3600000;

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

        // if (!user.verified) {
        //     return res.status(403).send({ message: "Email not verified" });
        // }
        if (!user.password) {
            return res.status(400).send({ error: "Invalid email or password" });
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
        user.refreshToken = undefined;

        await user.save();

        res.send({ message: "Password reset Successfully" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        if (req.user.password) {
            const isPasswordMatch = await bcrypt.compare(
                oldPassword,
                req.user.password
            );

            if (!isPasswordMatch) {
                return res.status(403).send({ error: "Invalid Credential" });
            }
        }
        req.user.password = newPassword;
        await req.user.save();

        res.send({ message: "Password Changed Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Server Error" });
    }
};

const socialLoginCallback = async (req, res) => {
    try {
        const accessToken = await req.user.generateAccessToken();
        const refreshToken = await req.user.generateRefreshToken();

        req.user.refreshToken = refreshToken;
        req.user.verified = true;
        await req.user.save();

        res.send({ accessToken, refreshToken });
    } catch (error) {
        res.json(error);
    }
};

const userProfile = async (req, res) => {
    try {
        if (req.method == "GET") {
            res.send(req.user);
        } else if (req.method == "PATCH") {
            const {
                username,
                fullName,
                gender,
                email,
                phoneNumber,
                bio,
                location,
                age,
            } = req.body;
            const userId = req.user._id;
            const user = await User.findByIdAndUpdate(
                userId,
                {
                    username,
                    fullName,
                    gender,
                    email,
                    phoneNumber,
                    bio,
                    location,
                    age,
                },
                { new: true, runValidators: true }
            );
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.send(user);
        } else {
            res.status(405).send({ message: "Method not allowed" });
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};
const updateUserNewsInterest = async (req, res) => {
    /*  #swagger.parameters['body'] = {
                in: 'body',
                schema: {
                    $newsInterests: ['technology',],
                    
                }
        } */
    const { newsInterests } = req.body;

    try {
        if (req.method == "PATCH") {
            req.user.newsInterests = [
                ...new Set([...req.user.newsInterests, ...newsInterests]),
            ];
            await req.user.save();
            res.send({ message: "Interests Added successfully" });
        } else if (req.method == "DELETE") {
            req.user.newsInterests = req.user.newsInterests.filter(
                (interest) => !newsInterests.includes(interest)
            );
            await req.user.save();
            res.send({ message: "Interest Removed successfully" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const updateUserNewsSources = async (req, res) => {
    /*  #swagger.parameters['body'] = {
                in: 'body',
                description: 'Some description...',
                schema: {
                    $newsSources: ['bbc-news',],
                    
                }
        } */
    const { newsSources } = req.body;
    try {
        if (req.method == "PATCH") {
            req.user.newsSources = [
                ...new Set([...req.user.newsSources, ...newsSources]),
            ]; // Ensure unique news sources
            await req.user.save();
            res.send({ message: "News Source added successfully" });
        } else if (req.method == "DELETE") {
            req.user.newsSources = req.user.newsSources.filter(
                (source) => !newsSources.includes(source)
            );
            await req.user.save();
            res.send({ message: "News source removed" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
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
    changePassword,
    socialLoginCallback,
    updateUserNewsInterest,
    updateUserNewsSources,
    userProfile,
    getUsers,
};
