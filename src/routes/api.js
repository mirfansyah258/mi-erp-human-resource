const express = require('express');
const router = express.Router();

// Import your resource-specific route files
const laborRoutes = require('./labor');
const companyRoutes = require('./company');
const departmentRoutes = require('./department');
const positionRoutes = require('./position');
// ... other resource routes

// Mount the resource-specific routes
router.use('/labor', laborRoutes);
router.use('/company', companyRoutes);
router.use('/department', departmentRoutes);
router.use('/position', positionRoutes);
// ... other resource routes

module.exports = router;