const newsService = require("../services/newsService");

const getNews = async (req, res) => {
    const { category, sources, q, from, to, language, country } = req.query;
    try {
        const news = await newsService.getNews(
            category,
            sources,
            q,
            from,
            to,
            language,
            country
        );
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPersonalizedNews = async (req, res) => {
    try {
        const { newsInterests } = req.user;
        const news = await newsService.getNews((category = newsInterests));
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const searchNews = async (req, res) => {
    const { q, sources, from, to, sortBy } = req.query;
    try {
        const news = await newsService.searchNews(q, sources, from, to, sortBy);
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSources = async (req, res) => {
    try {
        const sources = await newsService.getSources();
        res.status(200).json(sources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getNews, searchNews, getSources, getPersonalizedNews };
