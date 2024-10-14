const express = require('express');
const {verifyToken} = require('../middleware/auth.middleware.js');
const { 
    importInOut
} = require('../controllers/import_inout.controller.js');

const router = express.Router();

router.post('/import/:id', verifyToken, importInOut);

module.exports = router;