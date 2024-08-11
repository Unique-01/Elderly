require("./config/mongoose.js");
require("dotenv").config();
require("./services/resetUsedTodayAndExtendReminder");

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const swaggerDocument = require("./swagger.json");
const passport = require("./config/passport-setup.js");

const userRouter = require("./routes/userRoute.js");
const newsRouter = require("./routes/newsRoute.js");
const medicineRouter = require("./routes/medicineRoute");
const communityRouter = require("./routes/communityRoute.js");
const postRouter = require("./routes/postRoute.js");
const commentRouter = require("./routes/commentRoute.js");
const messageRouter = require("./routes/messageRoute.js");
const audioBookRouter = require("./routes/audioBookRoute.js");
const notificationRouter = require("./routes/notificationRoute.js");

const app = express();

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(express.json());
app.use(passport.initialize());
app.use(cors({ origin: process.env.CORS_ORIGIN }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(express.static(path.join(__dirname, "../public")));

// Route to serve the documentation
app.get("/socket-docs", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "socketDocs.html"));
});

app.use("/api/", userRouter);
app.use("/api", newsRouter);
app.use("/api", medicineRouter);
app.use("/api", communityRouter);
app.use("/api", postRouter);
app.use("/api", commentRouter);
app.use("/api", messageRouter);
app.use("/api", audioBookRouter);
app.use("/api", notificationRouter);

module.exports = app;
