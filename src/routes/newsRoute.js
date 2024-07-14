const express = require("express");
const newsController = require("../controller/newsController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/news", newsController.getNews /* #swagger.tags = ['News'] */);
router.get(
    "/news/search",
    newsController.searchNews /* #swagger.tags = ['News'] */
);
router.get(
    "/news/sources",
    newsController.getSources /* #swagger.tags = ['News'] */
);
router.get(
    "/news/personalizedNews",
    authMiddleware,
    newsController.getPersonalizedNews /* #swagger.tags = ['News'] */
);

module.exports = router;
