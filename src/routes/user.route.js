const express = require('express');
const {verifyToken} = require('../middleware/auth.middleware.js');
const { 
    getDataTable,
    getDataById,
    createData,
    updateData,
    deleteData, 
    updatePassword,
    getCountDatas
} = require('../controllers/user.controller.js');

const { 
    importData,
    exportData 
} = require('../controllers/import_export_user.controller.js');
const { uploadPhoto, deletePhoto } = require('../controllers/photo_user.controller.js');
const { 
    getDatas:getDataAtasan
} = require('../controllers/atasan.controller.js');

const router = express.Router();

router.get('/table', verifyToken, getDataTable);
router.get('/count', verifyToken, getCountDatas);
router.get('/data/:id', verifyToken, getDataById);
router.post('/data', verifyToken, createData);
router.patch('/data/:id', verifyToken, updateData);
router.delete('/data/:id', verifyToken, deleteData);
router.patch('/password/:id', verifyToken, updatePassword);

//import export user
router.post('/import', verifyToken, importData);
router.get('/export', verifyToken, exportData);

//photo
router.patch('/photo/:id', verifyToken, uploadPhoto);
router.delete('/photo/:id', verifyToken, deletePhoto);

//atasan
router.get('/atasan', verifyToken, getDataAtasan);


module.exports = router;