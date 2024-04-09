const Framework = require('../models/library')

const Library = require('../models/library')

const asyncHandler = require("express-async-handler")


exports.library_list = asyncHandler( async(req, res, next) => {

    const libraries = await Library.find().populate("language").exec()

    console.log(libraries[0])
    
    res.render("library_list", {
        title: "Libraries",
        libraries: libraries,
    })
})