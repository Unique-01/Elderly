const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authenticateSocket = async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error("Authentication error: Token not provided"));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        socket.user = await User.findById(decoded._id);
        if (!socket.user) {
            return next(new Error("Authentication error: User not found"));
        }
        if (!socket.user.verified) {
            return next(
                new Error("Authentication error: User is not verified")
            );
        }

        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return next(new Error("Authentication error: Token has expired"));
        }
        if (err.name === "JsonWebTokenError") {
            return next(new Error("Authentication error: Invalid token"));
        }
        return next(new Error(`Authentication error: ${err.message}`));
    }
};

module.exports = authenticateSocket;
