const express = require('express');
const {verifyToken} = require('../middleware/auth.middleware.js');
const { 
    getUserTable, 
    getUserById, 
    createUser, 
    deleteUser, 
    updateUser, 
    updatePassword,
} = require('../controllers/user.controller.js');

const { importUser, exportUser } = require('../controllers/import_export_user.controller.js');
const { uploadPhoto, deletePhoto } = require('../controllers/photo_user.controller.js');

const router = express.Router();

router.get('/table', verifyToken, getUserTable);
router.get('/data/:id', verifyToken, getUserById);
router.post('/data', verifyToken, createUser);
router.patch('/data/:id', verifyToken, updateUser);
router.delete('/data/:id', verifyToken, deleteUser);
router.patch('/password/:id', verifyToken, updatePassword);

//import
router.post('/import', verifyToken, importUser);
router.get('/export', exportUser);

//photo
router.patch('/photo/:id', uploadPhoto);
router.delete('/photo/:id', deletePhoto);

module.exports = router;