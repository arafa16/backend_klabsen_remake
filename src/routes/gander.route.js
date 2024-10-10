const express = require('express');
const {verifyToken} = require('../middleware/auth.middleware.js');
const { 
    getGanderTable,
    getGanderById,
    createGanderById,
    updateGander,
    deleteGander
} = require('../controllers/gander.controller.js');

const router = express.Router();

router.get('/table', verifyToken, getGanderTable);
router.get('/data/:id', verifyToken, getGanderById);
router.post('/data', verifyToken, createGanderById);
router.patch('/data/:id', verifyToken, updateGander);
router.delete('/data/:id', verifyToken, deleteGander);

module.exports = router;