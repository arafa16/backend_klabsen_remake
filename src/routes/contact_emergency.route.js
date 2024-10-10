const express = require('express');
const {verifyToken} = require('../middleware/auth.middleware.js');
const { 
    getContactEmergencyTable,
    getContactEmergencyById,
    createContactEmergencyById,
    updateContactEmergency,
    deleteContactEmergency
} = require('../controllers/contact_emergency.controller.js');

const router = express.Router();

router.get('/table', verifyToken, getContactEmergencyTable);
router.get('/data/:id', verifyToken, getContactEmergencyById);
router.post('/data', verifyToken, createContactEmergencyById);
router.patch('/data/:id', verifyToken, updateContactEmergency);
router.delete('/data/:id', verifyToken, deleteContactEmergency);

module.exports = router;