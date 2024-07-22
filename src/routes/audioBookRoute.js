const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const fileUpload = require("../middleware/fileUpload");
const {
    AddAudioBook,
    getAllAudioBook,
    getAudioBook,
    updateAudioBook,
    deleteAudioBook,
} = require("../controllers/audioBookController");

const router = express.Router();

router.post(
    "/audioBook",
    authMiddleware,
    fileUpload.fields([
        { name: "audioFile", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    AddAudioBook /* #swagger.tags=['AudioBook'] */
);
router.get(
    "/audioBook",
    authMiddleware,
    getAllAudioBook /* #swagger.tags=['AudioBook'] */
);
router.get(
    "/audioBook/:audioBookId",
    authMiddleware,
    getAudioBook /* #swagger.tags=['AudioBook'] */
);
router.patch(
    "/audioBook/:audioBookId",
    authMiddleware,
    updateAudioBook /* #swagger.tags=['AudioBook'] */
);
router.delete(
    "/audioBook/:audioBookId",
    authMiddleware,
    deleteAudioBook /* #swagger.tags=['AudioBook'] */
);

module.exports = router;
