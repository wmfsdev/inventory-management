const { body, validationResult } = require("express-validator")

const Framework = require('../models/framework')
const Tool = require('../models/tool')
const Library = require('../models/library')
const Language = require('../models/language')
const Image = require('../models/image')

const asyncHandler = require("express-async-handler")
const multer = require('multer')

const storage = multer.memoryStorage()
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG files are allowed!'), false);
    }
};
const upload = multer({ storage: storage, fileFilter: fileFilter, fileSize: 1000000 })


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

    const languages = await Language.find().populate("image", "img")

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
    .populate(
        "image",
        "img"
    )
    .exec()

    if (language.image === null) {
        res.render("language_detail", {
            title: "Languages",
            language: language,
        })
    } else {
        const image = "data:image/jpg;base64," + language.image.img.data.toString("base64")

        res.render("language_detail", {
            title: "Languages",
            language: language,
            image: image
        })
    }
})

// LANGUAGE
// CREATE: GET
exports.language_create_get = asyncHandler( async(req, res, next) => {
    res.render("language_form", {
        title: "Add Language",
        image: null,
    })
})

// CREATE: POST
exports.language_create_post = [
    upload.single('upload'),
    
    body("name") 
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
        .trim()
        .escape(),

    asyncHandler( async(req, res, next) => {

        const errors = validationResult(req)

        let language = new Language({
            title: req.body.name,
            typeSystem: req.body.type_system,
            version: req.body.version,
            released: req.body.release_date,
            desc: req.body.description,
            image: null
        })
        if (typeof(req.body.frameworkvalues) === 'string') {
            req.body.frameworkvalues = [req.body.frameworkvalues]
        }

        if (req.file) {
            const image = new Image({
                name: req.file.originalname,
                img: {
                    data: req.file.buffer,
                    contentType: req.file.mimetype,
                }
            })
            language.image = image._id
            await image.save()
        }

        if (!errors.isEmpty()) {
            res.render("language_form", {
                title: "Add Language",
                language: language,
                errors: errors.array(),
            })
        } else {
        const languageExists = await Language.findOne({ title: req.body.name }).exec()

        if (languageExists) {
            res.redirect(languageExists.urlid)
        } else if (req.body.frameworkvalues) {

            req.body.frameworkvalues.forEach( async(value) => {

                const framework = new Framework({
                    title: value,
                    type: undefined,
                    url: undefined,
                    version: undefined,
                    released: undefined,
                    desc: undefined,
                    language: [],
                })
                framework.language = language._id
                language.framework.push(framework._id) 

                await framework.save()
            })
                await language.save()
                res.redirect(`/technologies/language/${language._id}`) 

        } else {
            await language.save()
            res.redirect(`/technologies/language/${language._id}`) 
        }
      }
    }),
]

// UPDATE: GET
exports.language_update_get = asyncHandler( async(req, res, next) => {

    const language = await Language.findById(req.params.id).populate("framework", "title").populate("image", "img").exec()

    if (language.image === null) {
        res.render("language_form", {
            title: "Language Update",
            language: language
        })
    } else {
        const image = "data:image/jpg;base64," + language.image.img.data.toString("base64")

        res.render("language_form", {
            title: "Language Update",
            language: language,
            image: image
        })
    } 
})

// UPDATE: POST
exports.language_update_post = [
    upload.single('upload'),
    
    body("name") 
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
        .trim()
        .escape(),

    asyncHandler( async(req, res, next) => {

        const errors = validationResult(req)

        let language = new Language({
            title: req.body.name,
            typeSystem: req.body.type_system,
            version: req.body.version,
            released: req.body.release_date,
            desc: req.body.description,
            image: null,
            _id: req.params.id
        })
        
        if (typeof(req.body.frameworkvalues) === 'string') {
            req.body.frameworkvalues = [req.body.frameworkvalues]
        }

        const findImage = await Language.findById(req.params.id)

        if (req.file) {
            if (findImage.image === null) {
                const image = new Image({
                    name: req.file.originalname,
                    img: {
                        data: req.file.buffer,
                        contentType: req.file.mimetype,
                    }
                })
                language.image = image._id
                await image.save()
                await Language.findByIdAndUpdate(req.params.id, language)
            } else if (findImage === undefined) {
                const image = new Image({
                    name: req.file.originalname,
                    img: {
                        data: req.file.buffer,
                        contentType: req.file.mimetype,
                    }
                })
                language.image = image._id
                await image.save()
                await language.save()
            } else {
                const image = new Image({
                name: req.file.originalname,
                img: {
                    data: req.file.buffer,
                    contentType: req.file.mimetype,
                },
                _id: req.body.image_id,
            })
            language.image = image._id

            await Image.findByIdAndUpdate(req.body.image_id, image)
            } 
        } else {
            language.image = req.body.image_id
        }

        if (!errors.isEmpty()) {
            res.render("language_form", {
                title: "Add Language",
                language: language,
                errors: errors.array(),
            })
        } else {   
        
            const languageExists = await Language.findOne({ title: req.body.name }).exec()

            if (languageExists) {

                if (!req.body.frameworkvalues) {
                    await languageExists.save()
                    res.redirect(`/technologies/language/${language._id}`) 
                } else {
                    req.body.frameworkvalues.forEach( async(value) => {
                    
                        const framework = new Framework({
                            title: value,
                            type: undefined,
                            url: undefined,
                            version: undefined,
                            released: undefined,
                            desc: undefined,
                            language: [],
                        })
                        framework.language = language._id
                        
                        languageExists.framework.push(framework._id) 
                        await framework.save()
                    })
                    await languageExists.save()
                    res.redirect(`/technologies/language/${language._id}`)        
                }
            }
        }
    })
]

exports.language_delete_post = asyncHandler( async(req, res, next) => {

    const language = await Language.findByIdAndDelete(req.params.id).exec()

    language.framework.forEach( async(id) => {
        const framework = await Framework.findById(id)
        framework.language.pull( {_id: `${req.params.id}`} )
        await framework.save()
    })

    res.redirect(`/technologies/languages/`)
})