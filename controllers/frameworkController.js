const Framework = require('../models/framework')
const Language = require('../models/language')
const Image = require('../models/image')

const { body, validationResult } = require("express-validator")
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


exports.framework_list = asyncHandler( async(req, res, next) => {

    const frameworks = await Framework.find().populate({path: "language", select: "title"}).exec()
    
    res.render("framework_list", {
        title: "Frameworks",
        frameworks: frameworks,
    })
})

exports.framework_detail = asyncHandler( async(req, res, next) => {

    const framework = await Framework.findById(req.params.id).populate({path: "language", select: "title"}).exec()

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

exports.framework_create_post = [
    upload.single('upload'),
    
    body("name") 
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Please enter a name for the framework"),
    body("type") 
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Please enter a type for the framework"),
    body("url") 
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Please enter a url for the framework's documentation"),
    body("version") 
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Please enter a name for the framework"),
    body("released", "Invalid date") 
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),
    body("desc")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("no desc"),
    body("language")
        .trim()
        .escape(),


    asyncHandler( async(req, res, next) => {

        const errors = validationResult(req)

        let framework = new Framework({
            title: req.body.name,
            type: req.body.type,
            url: req.body.url,
            version: req.body.version,
            released: req.body.released,
            desc: req.body.desc,
            language: req.body.language,
            image: null
        })

        if (req.file) {
            const image = new Image({
                name: req.file.originalname,
                img: {
                    data: req.file.buffer,
                    contentType: req.file.mimetype,
                }
            })
            framework.image = image._id
            await image.save()
        }

        if (!errors.isEmpty()) {
            const languages = await Language.find({}, 'title')

            res.render("framework_form", {
                title: "validation test",
                framework: framework,
                languages: languages,
                errors: errors.array(),
            })
        } else {
        
            let languageNames = []

            if (typeof req.body.language === "string") {
                languageNames.push(req.body.language)
            } else {
                languageNames = req.body.language
            }

            const languageIds = languageNames.map( async(name) => await Language.find( { title: name }, '_id' ))

            const promiseValues = await Promise.all(languageIds)

            function extractLanguageIds(promise) {
                const idArray = []
                for (let i = 0 ; i < promise.length ; i++) {
                    idArray.push(promise[i][0]._id)
                }
                return idArray
            }
            framework.language = extractLanguageIds(promiseValues)
            await framework.save()

            promiseValues.forEach( async(id) => {
                const language = await Language.findById(id).exec()
                language.framework.push(framework._id)
                await language.save()
            })
            
           res.redirect(`/technologies/framework/${framework._id}`)
        } 
    })
]