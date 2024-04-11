
// import MODELS

const Framework = require('../models/framework')
const Tool = require('../models/tool')
const Library = require('../models/library')
const Language = require('../models/language')

const asyncHandler = require("express-async-handler")

// export function handlers

exports.index = asyncHandler( async(req, res, next) => {

    const [
        numLanguages,
        numFrameworks,
        numLibraries,
        numTools
    ] = await Promise.all([
        Language.countDocuments({}).exec(),
        Framework.countDocuments({}).exec(),
        Library.countDocuments({}).exec(),
        Tool.countDocuments({}).exec()
    ])

    res.render("index", {
        language_count: numLanguages,
        framework_count: numFrameworks,
        library_count: numLibraries,
        tool_count: numTools,
    })
})

exports.language_list = asyncHandler( async(req, res, next) => {

    const languages = await Language.find()
    
    res.render("language_list", {
        title: "Languages List",
        languages: languages,
        tech: languages[0].library
    })
})

exports.language_detail = asyncHandler( async(req, res, next) => {

    const language = await Language.findById(req.params.id)
    .populate({
        path: "framework",
        select: "title",
    })
    .populate(
        "library",
        "title"
    )
    .exec()

    console.log(language)

    res.render("language_detail", {
        title: "Languages",
        language: language,
    })
})

// CREATE NEW LANGUAGE
// GET
exports.language_create_get = asyncHandler( async(req, res, next) => {
    res.render("language_form", {
        title: "create"
    })
})

// POST
exports.language_create_post = asyncHandler( async(req, res, next) => {

    const language = await Language.find()
})