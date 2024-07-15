require("./config/mongoose.js");
require("dotenv").config();
require("./services/resetUsedTodayAndExtendReminder")

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const userRouter = require("./routes/userRoute.js");
const newsRouter = require("./routes/newsRoute.js");
const medicineRouter = require("./routes/medicineRoute");
const passport = require("./passport-setup.js");

const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(passport.initialize());
app.use("/api/", userRouter);
app.use("/api", newsRouter);
app.use("/api", medicineRouter);

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});
