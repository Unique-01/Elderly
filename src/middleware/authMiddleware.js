const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded_token = jwt.verify(token, JWT_ACCESS_SECRET);
        const user = await User.findOne({
            _id: decoded_token._id,
        });

        if (!user) {
            throw new Error();
        }
        req.user = user;

        next();
    } catch (error) {
        res.status(401).send({
            error: "Authentication Credentials not provided",
        });
    }
};

module.exports = authMiddleware;
