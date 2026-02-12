const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { createOrg, joinOrg, getMyOrgs, switchOrg } = require('../controllers/org.controller');

const router = express.Router();

router.post('/create', authMiddleware, createOrg);
router.post('/join', authMiddleware, joinOrg);
router.patch('/switch', authMiddleware, switchOrg);
router.get('/me', authMiddleware, getMyOrgs);

module.exports = router;
