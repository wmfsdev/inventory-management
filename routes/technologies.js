const express = require('express');
const router = express.Router();

const tech_controller = require("../controllers/techController")
const framework_controller = require("../controllers/frameworkController")
const library_controller = require("../controllers/libraryController")
// ROUTES
// GET home page
router.get('/', tech_controller.index)

// create GET - display form
router.get('/languages/create', tech_controller.language_create_get)

// create POST - submit form
router.post('/languages/create', tech_controller.language_create_post)

router.get('/language/:id', tech_controller.language_detail)

router.get('/languages', tech_controller.language_list)




// FRAMEWORKS
router.get('/frameworks', framework_controller.framework_list)


// LIBRARIES
router.get('/libraries', library_controller.library_list)

router.get('/library/:id', library_controller.library_detail)

module.exports = router;