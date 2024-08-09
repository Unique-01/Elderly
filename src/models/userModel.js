// require("dotenv").config();
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
    },
    fullName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) throw new Error("Invalid Email");
        },
    },
    phoneNumber: {
        type: Number,
    },
    bio: {
        type: String,
    },
    location: {
        type: String,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: false,
    },
    password: {
        type: String,
        min: 6,
    },
    age:{
        type:Number
    },
    refreshToken: {
        type: String,
    },
    googleId: {
        type: String,
    },
    profilePicture:{
        type:String
    },
    // verified: {
    //     type: Boolean,
    //     default: false,
    // },
    // verificationCode: {
    //     type: String,
    // },
    // verificationCodeExpires: {
    //     type: Date,
    // },
    newsInterests: {
        type: [String],
    },
    newsSources: {
        type: [String],
    },
});

UserSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 10);
    }

    next();
});

UserSchema.methods.generateAccessToken = async function () {
    const user = this;

    const accessToken = jwt.sign(
        { _id: user._id.toString() },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "15m" }
    );

    return accessToken;
};

UserSchema.methods.generateRefreshToken = async function () {
    const user = this;

    const refreshToken = jwt.sign(
        { _id: user._id.toString() },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "2w" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    return refreshToken;
};

UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.refreshToken;
    delete userObject.verificationCode;
    delete userObject.verificationCodeExpires;
    delete userObject.googleId;

    return userObject;
};

const User = new mongoose.model("User", UserSchema);

module.exports = User;
