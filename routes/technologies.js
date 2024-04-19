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

// update GET
router.get('/language/:id/update', tech_controller.language_update_get)

// update POST
router.post('/language/:id/update', tech_controller.language_update_post)


// FRAMEWORKS
router.get('/frameworks/create', framework_controller.framework_create_get)

router.post('/frameworks/create', framework_controller.framework_create_post)

router.get('/frameworks', framework_controller.framework_list)

router.get('/framework/:id', framework_controller.framework_detail)


// LIBRARIES
router.get('/libraries', library_controller.library_list)

router.get('/library/:id', library_controller.library_detail)

module.exports = router;