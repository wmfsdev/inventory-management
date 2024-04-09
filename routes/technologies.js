const express = require('express');
const router = express.Router();

const tech_controller = require("../controllers/techController")
const framework_controller = require("../controllers/frameworkController")
const library_controller = require("../controllers/libraryController")
// ROUTES
// GET home page
router.get('/', tech_controller.index)

router.get('/language/:id', tech_controller.language_detail)

router.get('/languages', tech_controller.language_list)


// FRAMEWORKS
router.get('/frameworks', framework_controller.framework_list)


// LIBRARIES
router.get('/libraries', library_controller.library_list)


module.exports = router;