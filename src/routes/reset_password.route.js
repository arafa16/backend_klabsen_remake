const express = require('express');
const {sendEmailReset, getTokenReset, resetPassword} = require('../controllers/reset_password.controller.js');

const router = express.Router();

router.post('/email', sendEmailReset);
router.get('/:token', getTokenReset);
router.post('/:token', resetPassword);

module.exports = router;