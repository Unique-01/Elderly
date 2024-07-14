require("dotenv").config();
const NewsAPI = require("newsapi");

const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

const getNews = async (
    category = "general",
    sources = "",
    q = "",
    from = "",
    to = "",
    language = "en",
    country = "us"
) => {
    try {
        const response = await newsapi.v2.topHeadlines({
            category,
            sources,
            q,
            from,
            to,
            language,
            country,
        });
        return response.articles;
    } catch (error) {
        console.log(error)
        throw new Error("Error fetching news");
    }
};

const searchNews = async (
    q,
    sources = "",
    from = "",
    to = "",
    language = "en",
    sortBy = "relevancy"
) => {
    try {
        const response = await newsapi.v2.everything({
            q,
            sources,
            from,
            to,
            language,
            sortBy,
        });
        return response.articles;
    } catch (error) {
        throw new Error("Error searching news");
    }
};

const getSources = async () => {
    try {
        const response = await newsapi.v2.sources();
        return response.sources;
    } catch (error) {
        throw new Error("Error fetching news sources");
    }
};

module.exports = { getNews, searchNews, getSources };
