const mongoose = require("mongoose");

const AudioBookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        author: {
            type: String,
        },
        description: {
            type: String,
        },
        audioFile: {
            type: String,
        },
        duration: {
            type: Number,
        },
        coverImage: {
            type: String,
        },
        genre: {
            type: String,
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
        },
    },
    { timestamps: true }
);

const AudioBook = new mongoose.model("AudioBook", AudioBookSchema);

module.exports = AudioBook;
