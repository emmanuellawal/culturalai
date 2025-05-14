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
const authRoutes = require('./auth');

// Mount the admin routes
router.use('/admin', adminRoutes);

// Mount the auth routes
router.use('/auth', authRoutes);

// Mount the API routes
router.use('/cultures', cultureRoutes);
router.use('/norms', normRoutes);
router.use('/idioms', idiomRoutes);
router.use('/analysis', analysisRoutes);

// Export the router
module.exports = router; 