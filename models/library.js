const mongoose = require("mongoose")

const Schema = mongoose.Schema

const LibrarySchema = new Schema({
    title: { type: String, required: true, maxLength: 40 },
    url: { type: String, required: true },
    version: { type: Number, required: true },
    released: { type: Date, required: true },
    desc: { type: String, required: true },
    language: [{ type: Schema.Types.ObjectId, required: true, ref: "Language" }]
});

module.exports = mongoose.model("Library", LibrarySchema)