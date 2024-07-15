const mongoose = require("mongoose");

const medicineSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["Capsule", "Drop", "Tablet"],
        required: true,
    },
    dose: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    reminder: {
        type: Date,
    },
    usedToday: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
});

const Medicine = mongoose.model("Medicine", medicineSchema);

module.exports = Medicine;
