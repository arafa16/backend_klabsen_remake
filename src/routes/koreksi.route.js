const express = require('express');
const {verifyToken} = require('../middleware/auth.middleware.js');
const { 
    getDatas,
    getDataTable,
    getDataById,
    createData,
    createDataByDate,
    updateData,
    deleteData,
    getCountDatas,
    approvalData
} = require('../controllers/koreksi.controller.js');

const router = express.Router();

router.get('/datas', verifyToken, getDatas);
router.get('/table', verifyToken, getDataTable);
router.get('/count', verifyToken, getCountDatas);
router.get('/data/:id', verifyToken, getDataById);
router.post('/data', verifyToken, createData);
router.post('/date', verifyToken, createDataByDate);
router.patch('/data/:id', verifyToken, updateData);
router.patch('/approval/:id', verifyToken, approvalData);
router.delete('/data/:id', verifyToken, deleteData);

module.exports = router;