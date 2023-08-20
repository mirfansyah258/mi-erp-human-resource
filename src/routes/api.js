const express = require('express');
const router = express.Router();

// Import your resource-specific route files
const laborRoutes = require('./labor');
// ... other resource routes

// Mount the resource-specific routes
router.use('/labor', laborRoutes);
// ... other resource routes

module.exports = router;