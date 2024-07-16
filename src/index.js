require("./config/mongoose.js");
require("dotenv").config();
require("./services/resetUsedTodayAndExtendReminder");

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const swaggerDocument = require("./swagger.json");
const userRouter = require("./routes/userRoute.js");
const newsRouter = require("./routes/newsRoute.js");
const medicineRouter = require("./routes/medicineRoute");
const communityRouter = require("./routes/communityRoute.js");
const passport = require("./passport-setup.js");

const app = express();

const port = process.env.PORT;

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use("/api/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(passport.initialize());
app.use("/api/", userRouter);
app.use("/api", newsRouter);
app.use("/api", medicineRouter);
app.use("/api", communityRouter);

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});
