const express = require("express");
const {
    addMedicine,
    usedMedicine,
    getUserMedicine,
    updateMedicine,
    deleteMedicine,
} = require("../controllers/medicineController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/medicine",
    authMiddleware,
    addMedicine /* #swagger.tags = ['Medicine'] */
);
router.patch(
    "/medicine/:medicineId/usedToday",
    authMiddleware,
    usedMedicine /* #swagger.tags = ['Medicine'] */
);
router.get(
    "/medicine",
    authMiddleware,
    getUserMedicine /* #swagger.tags = ['Medicine'] */
);
router.patch(
    "/medicine/:medicineId/update",
    authMiddleware,
    updateMedicine /* #swagger.tags = ['Medicine'] */
);
router.delete(
    "/medicine/:medicineId/delete",
    authMiddleware,
    deleteMedicine /* #swagger.tags = ['Medicine'] */
);

module.exports = router
