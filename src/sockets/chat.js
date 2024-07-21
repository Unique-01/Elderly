const Message = require("../models/messageModel");
const Community = require("../models/communityModel");
const authenticateSocket = require("../middleware/authenticateSocket");

const chatSocketHandler = (io) => {
    io.use(authenticateSocket);

    io.on("connection", (socket) => {
        console.log("New client connected");
        socket.emit("connected", { message: "You are connected!" });

        socket.on("join", (userId) => {
            if (socket.user._id.toString() !== userId) {
                return socket.emit("error", "Unauthorized");
            }
            socket.join(userId);
            console.log("New User connected");
        });

        socket.on("private_message", async (data) => {
            const { senderId, recipientId, message } = data;

            if (
                !senderId ||
                !recipientId ||
                !message ||
                socket.user._id.toString() !== senderId
            ) {
                return socket.emit("error", "Invalid data or unauthorized");
            }

            try {
                const newMessage = new Message({
                    senderId,
                    recipientId,
                    message,
                });
                await newMessage.save();
                io.to(recipientId).emit("private_message", {
                    senderId,
                    message,
                });
                socket.emit("message_sent", "Message sent successfully");
            } catch (error) {
                console.error(error);
                socket.emit("error", "Error sending message");
            }
        });

        socket.on("join_community", async (communityId) => {
            try {
                const community = await Community.findById(communityId);
                if (!community) {
                    return socket.emit("error", "Community not found");
                }
                const isMember = community.members.includes(socket.user._id);
                if (!isMember) {
                    return socket.emit(
                        "error",
                        "You are not a member of this community"
                    );
                }
                socket.join(communityId);
                console.log(`User joined community ${communityId}`);
            } catch (error) {
                console.error(error);
                socket.emit("error", "Error joining community");
            }
        });

        socket.on("community_message", async (data) => {
            const { senderId, communityId, message } = data;

            if (
                !senderId ||
                !communityId ||
                !message ||
                socket.user._id.toString() !== senderId
            ) {
                return socket.emit("error", "Invalid data or unauthorized");
            }

            try {
                const community = await Community.findById(communityId);
                if (!community) {
                    return socket.emit("error", "Community not found");
                }
                const isMember = community.members.includes(socket.user._id);
                if (!isMember) {
                    return socket.emit(
                        "error",
                        "You are not a member of this community"
                    );
                }

                const newMessage = new Message({
                    senderId,
                    communityId,
                    message,
                });
                await newMessage.save();
                io.to(communityId).emit("community_message", {
                    senderId,
                    message,
                });
                socket.emit("message_sent", "Message sent successfully");
            } catch (error) {
                console.error(error);
                socket.emit("error", "Error sending message");
            }
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });
};

module.exports = chatSocketHandler;
