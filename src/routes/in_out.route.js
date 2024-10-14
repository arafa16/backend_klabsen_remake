const express = require('express');
const {verifyToken} = require('../middleware/auth.middleware.js');
const { 
    importInOut
} = require('../controllers/import_inout.controller.js');
const { 
    getDataById,
    getDataByUser,
    createData,
    updateData,
    deleteData
} = require('../controllers/inout.controller.js');

const router = express.Router();

router.get('/data/:id', verifyToken, getDataById);
router.get('/data/:id', verifyToken, getDataById);
router.get('/user/:id', verifyToken, getDataByUser);
router.post('/data', verifyToken, createData);
router.patch('/data/:id', verifyToken, updateData);
router.delete('/data/:id', verifyToken, deleteData);

//import data
router.post('/import/:id', verifyToken, importInOut);

module.exports = router;