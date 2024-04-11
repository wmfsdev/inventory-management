const Framework = require('../models/library')

const Library = require('../models/library')

const asyncHandler = require("express-async-handler")


exports.library_list = asyncHandler( async(req, res, next) => {

    const libraries = await Library.find().populate("language").exec()

    console.log(libraries)
    console.log("RENDER LIBRARY LIST")
    
    res.render("library_list", {
        title: "Libraries",
        libraries: libraries,
    })
})

exports.library_detail = asyncHandler( async(req, res, next) => {

    const library = await Library.findById(req.params.id).populate("language").exec()

    //console.log(library)
    console.log("RENDER LIBRARY DETAIL")
    console.log(library.language[0].urlid)
    
    res.render("library_detail", {
        title: "Library Detail",
        library: library,
    })
})