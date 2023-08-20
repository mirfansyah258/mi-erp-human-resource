const express = require('express');
const fileUpload = require('express-fileupload')
const { labor } = require('../controllers');
const router = express.Router();

// Define routes and map to controller methods
router.get('/', labor.getAll);
router.get('/:id', labor.getById);
router.post('/', fileUpload(), labor.create);
router.put('/:id', fileUpload(), labor.update);
router.delete('/:id', labor.delete);

module.exports = router;
