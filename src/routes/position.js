const express = require('express');
const { position } = require('../controllers');
const router = express.Router();

// Define routes and map to controller methods
router.get('/', position.getAll);
router.get('/:id', position.getById);
router.post('/', position.create);
router.put('/:id', position.update);
router.delete('/:id', position.delete);

module.exports = router;
