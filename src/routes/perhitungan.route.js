const express = require('express');
const {verifyToken} = require('../middleware/auth.middleware.js');
const { 
    getCountDatas,
    exportCountDatas
} = require('../controllers/perhitungan.controller.js');

const router = express.Router();

router.get('/count', verifyToken, getCountDatas);
router.get('/export/count', verifyToken, exportCountDatas);

module.exports = router;