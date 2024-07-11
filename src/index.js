require("./config/mongoose.js");
require("dotenv").config();

const express = require("express");
const userRouter = require("./routes/userRoute.js");

const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use("/api/", userRouter);

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});
