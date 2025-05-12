/**
 * Routes index file
 * Exports all route modules
 */

const express = require('express');
const router = express.Router();
const adminRoutes = require('./admin');
const cultureRoutes = require('./cultures');
const normRoutes = require('./norms');
const idiomRoutes = require('./idioms');
const analysisRoutes = require('./analysis');

// Mount the admin routes
router.use('/admin', adminRoutes);

// Mount the API routes
router.use('/api/cultures', cultureRoutes);
router.use('/api/norms', normRoutes);
router.use('/api/idioms', idiomRoutes);
router.use('/api/analysis', analysisRoutes);

// Export the router
module.exports = router; 