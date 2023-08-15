const express = require('express');
const authController = require('../controllers/resetController');

const router = express.Router();

router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOtp);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
