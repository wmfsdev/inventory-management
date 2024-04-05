const mongoose = require("mongoose")

const Schema = mongoose.Schema

const LanguageSchema = new Schema({
    title: { type: String, required: true, maxLength: 40 },
    typeSystem: [{ type: String, required: true, maxLength: 40 }],
    url: { type: String, required: true },
    version: { type: String, required: true },
    released: { type: Date, required: true },
    desc: { type: String, required: true },
});

LanguageSchema.virtual("typeSystem_list").get(function () {
    let typeSystemToString = ''

    for (let i = 0 ; i < this.typeSystem.length ; i++ ) {
        typeSystemToString += `${this.typeSystem[i]}, `
    }

    return typeSystemToString.slice(0, typeSystemToString.length - 2)
})

module.exports = mongoose.model("Language", LanguageSchema)