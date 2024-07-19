const swaggerAutogen = require("swagger-autogen")();
require("dotenv").config();

const doc = {
    info: {
        title: "Elderly App Documentation",
    },
    host: process.env.SERVER_HOST,
    basePath: "/api",
    schemes: ["http", "https"],
};

const outputFile = "../swagger.json";
const endpointsFiles = ["../routes/*.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
