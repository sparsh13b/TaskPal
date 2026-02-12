const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');

const { createTask, getTasks, updateTask } = require('../controllers/task.controller');

const router = express.Router();

router.post('/', authMiddleware, createTask);
router.get('/', authMiddleware, getTasks);
router.patch('/:id', authMiddleware, updateTask);

module.exports = router;