const express = require('express');
const {verifyToken} = require('../middleware/auth.middleware.js');
const { 
    getDatas,
    getDataTable,
    getDataTableByUser,
    createData,
    updateData,
    deleteData,
    getDataById
} = require('../controllers/pendapatan.controller.js');
const {
    importPendapatans,
    exportPendapatans
} = require('../controllers/import_export_pendapatan.controller.js');

const router = express.Router();

router.get('/datas', verifyToken, getDatas);
router.get('/admin/table', verifyToken, getDataTable);
router.get('/user/table', verifyToken, getDataTableByUser);
router.get('/data/:id', verifyToken, getDataById);
router.post('/data', verifyToken, createData);
router.patch('/data/:id', verifyToken, updateData);
router.delete('/data/:id', verifyToken, deleteData);

//import data
router.post('/import', verifyToken, importPendapatans);
router.get('/export', exportPendapatans);

module.exports = router;