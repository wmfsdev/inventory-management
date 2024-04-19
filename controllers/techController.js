const { body, validationResult } = require("express-validator")
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
        title: "Add Language"
    })
})

// POST
exports.language_create_post = [
    // validate and sanitise
    body("name") // check which body element name is referring
                 // to in language_form.pug
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Please enter a name for the programming language"),
    // body("url")
    //     .trim()
    //     .isLength({ min:1 })
    //     .escape()
    //     .withMessage("Please enter a URL for relevant documentation"),
    body("version")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Please provide a version number for latest release"),
    body("release_date", "Invalid date")
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),
    body("description")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("no desc"),
    body("framework")
        .escape(),

    asyncHandler( async(req, res, next) => {

      const errors = validationResult(req)

      const language = new Language({
          title: req.body.name,
          typeSystem: req.body.type_system,
          version: req.body.version,
          released: req.body.release_date,
          desc: req.body.description,
      })

      if (!errors.isEmpty()) {
          console.log("fail")
          res.render("language_form", {
              title: "Add Language",
              language: language,
              errors: errors.array(),
          })
      } else {
        const languageExists = await Language.findOne({ title: req.body.name }).exec()

        if (languageExists) {
            res.redirect(languageExists.urlid)
        } else if (req.body.framework) {

            const framework = new Framework({
                title: req.body.framework,
                type: undefined,
                url: undefined,
                version: undefined,
                released: undefined,
                desc: undefined,
                language: [],
            })
            console.log("pre-save", framework)
        
            framework.language = language._id
            language.framework = framework._id

            await framework.save()
            await language.save()
            console.log("post-save", framework)

            // maybe redirect to the declared framework?
        } else {
          console.log("saving")
          await language.save()
          console.log("language saved")
        }
      }
    }),
]

exports.language_update_get = asyncHandler( async(req, res, next) => {

const language = await Language.findById(req.params.id)
console.log(language)
    // res.render("language_update", {
    //     title: "Language Update"
    // })
})

exports.language_update_post = asyncHandler( async(req, res, next) => {

})