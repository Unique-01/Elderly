const Message = require("../models/messageModel");
const Community = require("../models/communityModel");

const chatSocketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log("New client connected");

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });
};

module.exports = chatSocketHandler;
