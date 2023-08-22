const express = require('express');
const { department } = require('../controllers');
const router = express.Router();

// Define routes and map to controller methods
router.get('/', department.getAll);
router.get('/:id', department.getById);
router.post('/', department.create);
router.put('/:id', department.update);
router.delete('/:id', department.delete);

module.exports = router;
