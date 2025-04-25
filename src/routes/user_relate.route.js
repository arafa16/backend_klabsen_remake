const express = require('express');
const {verifyToken} = require('../middleware/auth.middleware.js');
const { 
    getDatas,
    getDataTable,
    getDataTableByUser,
    getDataById,
    createData,
    updateData,
    deleteData
} = require('../controllers/user_relate.controller.js');

const router = express.Router();

router.get('/datas', verifyToken, getDatas);
router.get('/table', verifyToken, getDataTable);
router.get('/table/user', verifyToken, getDataTableByUser);
router.get('/data/:id', verifyToken, getDataById);
router.post('/data', verifyToken, createData);
router.patch('/data/:id', verifyToken, updateData);
router.delete('/data/:id', verifyToken, deleteData);

module.exports = router;