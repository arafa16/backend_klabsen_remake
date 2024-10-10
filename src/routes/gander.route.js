const express = require('express');
const {verifyToken} = require('../middleware/auth.middleware.js');
const { 
    getDataTable,
    getDataById,
    createData,
    updateData,
    deleteData
} = require('../controllers/gander.controller.js');

const router = express.Router();

router.get('/table', verifyToken, getDataTable);
router.get('/data/:id', verifyToken, getDataById);
router.post('/data', verifyToken, createData);
router.patch('/data/:id', verifyToken, updateData);
router.delete('/data/:id', verifyToken, deleteData);

module.exports = router;