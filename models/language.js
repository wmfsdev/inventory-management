const mongoose = require("mongoose")
const { DateTime } = require("luxon")

const Schema = mongoose.Schema

const LanguageSchema = new Schema({
    title: { type: String, required: true, maxLength: 40 },
    typeSystem: [{ type: String, required: true, maxLength: 40 }],
    url: { type: String },
    version: { type: String, required: true },
    released: { type: Date, required: true },
    desc: { type: String, required: true },
    framework: { type: Schema.Types.ObjectId, ref: "Framework" },
    library: [{ type: Schema.Types.ObjectId, ref: "Library" }],
    image: { type: Schema.Types.ObjectId, ref: "Image" }
});

LanguageSchema.virtual("tech_list").get(function () {
    const arr = []
    let techListToString = ''
    this.library.forEach((item) => {
        arr.push(item.title)
    })
    arr.forEach((item) => {
        techListToString += `${item}, `
    })
    return techListToString.slice(0, techListToString.length - 2)
})

LanguageSchema.virtual("released__yyyy_mm_dd").get( function() {
    return DateTime.fromJSDate(this.released).toISODate()
})

LanguageSchema.virtual("typeSystem_list").get(function () {
    let typeSystemToString = ''

    for (let i = 0 ; i < this.typeSystem.length ; i++ ) {
        typeSystemToString += `${this.typeSystem[i]}, `
    }

    return typeSystemToString.slice(0, typeSystemToString.length - 2)
})

LanguageSchema.virtual("urlid").get(function () {
    return `/technologies/language/${this._id}`;
});

module.exports = mongoose.model("Language", LanguageSchema)