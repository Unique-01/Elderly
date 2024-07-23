const axios = require("axios");
require("dotenv").config();

exports.latestNews = async () => {
    try {
        const news = await axios.get(
            `https://newsdata.io/api/1/latest?apikey=${process.env.NEWS_DATA_API_KEY}`
        );
        return news.data;
    } catch (error) {
        throw new Error(error);
    }
};
