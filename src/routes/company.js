const express = require('express');
const { company } = require('../controllers');
const router = express.Router();

// Category Company Routes
router.get('/category', company.getAllCategory);
router.get('/category/:id', company.getCategoryById);
router.post('/category', company.createCategory);
router.put('/category/:id', company.updateCategory);
router.delete('/category/:id', company.deleteCategory);

// Company Routes
router.get('/company', company.getAllCompany);
router.get('/company/:id', company.getCompanyById);
router.post('/company', company.createCompany);
router.put('/company/:id', company.updateCompany);
router.delete('/company/:id', company.deleteCompany);

module.exports = router;
