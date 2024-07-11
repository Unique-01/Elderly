require("dotenv").config();
const mongoose = require("mongoose");
const MONGODB_SERVER = process.env.MONGODB_SERVER;

const dbConnection = async () => {
    try {
        await mongoose.connect(MONGODB_SERVER);
        console.log("MongoDB server connected successfully");
    } catch (error) {
        console.log("Unable to connect to the mongoDB server", error);
    }
};

dbConnection();
