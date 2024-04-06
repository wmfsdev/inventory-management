
// import MODELS

const Framework = require('../models/framework')
const Tool = require('../models/tool')
const Library = require('../models/tool')
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

    const languages = await Language.find().exec()
    // console.log(languages)

    res.render("language_list", {
        title: "Languages",
        languages: languages,
    })
})

exports.language_detail = asyncHandler( async(req, res, next) => {

    const test = await Language.find().exec()
//console.log(test)
    res.render("test", {
        title: "test",
       urlid: test.urlid
    })
})