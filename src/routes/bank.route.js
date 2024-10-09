const express = require('express');
const {verifyToken} = require('../middleware/auth.middleware.js');
const { 
    getBankTable,
    getBankById,
    createBank,
    updateBank,
    deleteBank
} = require('../controllers/bank.controller.js');

const router = express.Router();

router.get('/table', verifyToken, getBankTable);
router.get('/data/:id', verifyToken, getBankById);
router.post('/data', verifyToken, createBank);
router.patch('/data/:id', verifyToken, updateBank);
router.delete('/data/:id', verifyToken, deleteBank);

module.exports = router;