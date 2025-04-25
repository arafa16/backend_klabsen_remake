const express = require('express');
const {verifyToken} = require('../middleware/auth.middleware.js');
const { 
    getDatas,
    getDataTable,
    getDataTableUser,
    getDataTableAssignor,
    getDataTableSuperior,
    getDataById,
    createData,
    updateData,
    updateStatusData,
    deleteData
} = require('../controllers/overtime_task.controller.js');

const router = express.Router();

router.get('/datas', verifyToken, getDatas);
router.get('/table', verifyToken, getDataTable);
router.get('/table/user', verifyToken, getDataTableUser);
router.get('/table/assignor', verifyToken, getDataTableAssignor);
router.get('/table/superior', verifyToken, getDataTableSuperior);
router.get('/data/:id', verifyToken, getDataById);
router.post('/data', verifyToken, createData);
router.patch('/data/:id', verifyToken, updateData);
router.patch('/data/:id/status', verifyToken, updateStatusData);
router.delete('/data/:id', verifyToken, deleteData);

module.exports = router;