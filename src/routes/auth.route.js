const express = require('express');
const {login, registration, getMe, logout} = require('../controllers/auth.controller.js');
const {verifyToken} = require('../middleware/auth.middleware.js');

const router = express.Router();


router.post('/login', login);
router.post('/registration', registration);
router.get('/me', verifyToken, getMe);
router.delete('/logout', logout);

module.exports = router;