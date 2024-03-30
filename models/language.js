const mongoose = require("mongoose")

const Schema = mongoose.Schema

const LanguageSchema = new Schema({
    title: { type: String, required: true, maxLength: 40 },
    typeSystem: [{ type: String, required: true, maxLength: 40 }],
    url: { type: String, required: true },
    version: { type: Number, required: true },
    released: { type: Date, required: true },
    desc: { type: String, required: true },
});

module.export = mongoose.model("Language", FrameworkSchema)