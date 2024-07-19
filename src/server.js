const http = require("http");
const socketIo = require("socket.io");
const app = require("./app");
const chatSocketHandler = require("./sockets/chat");

const port = process.env.PORT;

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        methods: ["GET", "POST"],
    },
});

chatSocketHandler(io);

server.listen(port, () => {
    console.log(`Server started at port ${port}`);
});
