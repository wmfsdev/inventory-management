const mongoose = require("mongoose")

const Schema = mongoose.Schema

const ImageSchema = new Schema({
    name: String,
    img: { data: Buffer, contentType: String },
});

module.exports = mongoose.model("Image", ImageSchema)