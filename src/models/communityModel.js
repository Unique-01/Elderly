const mongoose = require("mongoose");

const CommunitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    coverPhoto: { type: String },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Community = new mongoose.model("Community", CommunitySchema);

module.exports = Community;
