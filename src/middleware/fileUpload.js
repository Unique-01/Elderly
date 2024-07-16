const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const fileUpload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        const mimetype = fileTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error("Images only!"));
        }
    },
});

module.exports = fileUpload;
