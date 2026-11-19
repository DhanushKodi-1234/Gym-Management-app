const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../schema/user');
const sendemail = require('../utils/mail');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

const formatUser = (user) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  role: user.role,
  goal: user.goal,
  experience: user.experience,
  height: user.height,
  currentWeight: user.currentWeight,
  targetWeight: user.targetWeight,
  bmi: user.bmi,
  isVerified: user.isVerified
});

// @desc    Register user & send 6-digit OTP email
// @route   POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      goal,
      experience,
      dob,
      gender,
      height,
      currentWeight,
      targetWeight
    } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      goal,
      experience,
      dob,
      gender,
      height: Number(height),
      currentWeight: Number(currentWeight),
      targetWeight: Number(targetWeight),
      isVerified: false,
      otp,
      otpExpires
    });

    await sendemail(user.email, user.firstName, otp);

    res.status(201).json({
      success: true,
      requiresVerification: true,
      message: `Verification code sent to ${user.email}`,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error during signup' });
  }
};

// @desc    Verify email OTP & return JWT token
// @route   POST /api/auth/verify-email
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP code are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+otp +otpExpires');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Email is already verified.' });
    }

    if (!user.otp || user.otp !== otp.toString().trim() || user.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code.' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully!',
      token,
      user: formatUser(user)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error during verification' });
  }
};

// @desc    Resend 6-digit OTP email
// @route   POST /api/auth/resend-otp
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Email is already verified.' });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendemail(user.email, user.firstName, otp);

    res.status(200).json({
      success: true,
      message: `New verification code sent to ${user.email}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error resending OTP' });
  }
};

// @desc    Send OTP OR verify OTP & update password in DB
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your registered email.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+otp +otpExpires +password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with that email address.' });
    }

    // Step 1: Only email provided -> Generate & send 6-digit OTP
    if (!otp && !newPassword) {
      const generatedOtp = generateOTP();
      user.otp = generatedOtp;
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      await sendemail(user.email, user.firstName, generatedOtp);

      return res.status(200).json({
        success: true,
        message: `Password reset OTP sent to ${user.email}`,
        email: user.email
      });
    }

    // Step 2: Email + OTP + newPassword provided -> Verify OTP & update password in DB
    if (!otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'OTP and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    if (!user.otp || user.otp !== otp.toString().trim() || user.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully! Please sign in with your new password.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error during password reset.' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        requiresVerification: true,
        email: user.email,
        message: 'Please verify your email before logging in.'
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: formatUser(user)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error during login' });
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};