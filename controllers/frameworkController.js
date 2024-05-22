const Framework = require('../models/framework')
const Language = require('../models/language')

const asyncHandler = require("express-async-handler")


exports.framework_list = asyncHandler( async(req, res, next) => {

    const frameworks = await Framework.find().populate({path: "language", select: "title"}).exec()

    console.log(frameworks)
    
    res.render("framework_list", {
        title: "Frameworks",
        frameworks: frameworks,
    })
})

exports.framework_detail = asyncHandler( async(req, res, next) => {

    const framework = await Framework.findById(req.params.id).populate({path: "language", select: "title"}).exec()

    console.log(framework)

    res.render("framework_detail", {
        title: "Framework Detail",
        framework: framework,
    })
})

exports.framework_create_get = asyncHandler( async(req, res, next) => {

    const languages = await Language.find({}, 'title')

    res.render("framework_form", {
        title: "Create Framework",
        languages: languages
    })
})

exports.framework_create_post = asyncHandler( async(req, res, next) => {

})