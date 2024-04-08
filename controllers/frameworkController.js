const Framework = require('../models/framework')

const asyncHandler = require("express-async-handler")


exports.framework_list = asyncHandler( async(req, res, next) => {

    const frameworks = await Framework.find().populate("language").exec()

    console.log(frameworks)
    
    res.render("framework_list", {
        title: "Frameworks",
        frameworks: frameworks,
    })
})