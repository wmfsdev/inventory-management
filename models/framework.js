const mongoose = require("mongoose")

const Schema = mongoose.Schema

const FrameworkSchema = new Schema({
    title: { type: String, required: true, maxLength: 40 },
    type: { type: String, maxLength: 40 },
    url: { type: String, },
    version: { type: Number, },
    released: { type: Date, },
    desc: { type: String, },
    language: [{ type: Schema.Types.ObjectId, ref: "Language" }]
});

FrameworkSchema.virtual("urlid").get(function () {
    return `/technologies/framework/${this._id}`;
});

module.exports = mongoose.model("Framework", FrameworkSchema)