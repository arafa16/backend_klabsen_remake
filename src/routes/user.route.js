const express = require('express');
const {verifyToken} = require('../middleware/auth.middleware.js');
const { getUserTable, getUserById, createUser, deleteUser } = require('../controllers/user.controller.js');

const router = express.Router();

router.get('/table', verifyToken, getUserTable);
router.get('/data/:id', verifyToken, getUserById);
router.post('/data', verifyToken, createUser);
router.delete('/data/:id', verifyToken, deleteUser);

module.exports = router;