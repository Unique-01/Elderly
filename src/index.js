require("./config/mongoose.js");
require("dotenv").config();

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const userRouter = require("./routes/userRoute.js");
const newsRouter = require("./routes/newsRoute.js");
const passport = require("./passport-setup.js");

const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(passport.initialize());
app.use("/api/", userRouter );
app.use("/api", newsRouter);

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});
