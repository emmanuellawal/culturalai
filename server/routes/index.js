/**
 * Routes index file
 * Exports all route modules
 */

const express = require('express');
const router = express.Router();
const adminRoutes = require('./admin');

// Mount the admin routes
router.use('/admin', adminRoutes);

// Export the router
module.exports = router; 