const express = require('express');
const router = express.Router();

const { getDashboardStats } = require('../controllers/dashboard.controller');
const authMiddleware = require('../middleware/auth.middleware');   

router.get('/stats', authMiddleware, getDashboardStats);

module.exports = router;