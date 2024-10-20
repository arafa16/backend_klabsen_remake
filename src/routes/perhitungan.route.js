const express = require('express');
const {verifyToken} = require('../middleware/auth.middleware.js');
const { 
    getCountDatas
} = require('../controllers/perhitungan.controller.js');

const router = express.Router();

router.get('/count', verifyToken, getCountDatas);

module.exports = router;