const express = require('express');
const router = express.Router();
const { signup, login, getMe,verifyEmail,resendOtp,forgotPassword} = require('../controllers/authcontrollers'); 
const { protect } = require('../middlewares/authMiddleware'); 

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOtp);
router.post('/forgot-password', forgotPassword);
module.exports = router;