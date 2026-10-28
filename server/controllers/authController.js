const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { serializeUser } = require('../utils/serializers');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'bookease_secret_key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc Register user
// @route POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address is already registered.',
      });
    }

    const assignedRole = role === 'Admin' ? 'Admin' : 'User';

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password,
      role: assignedRole,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: serializeUser(user),
    });
  } catch (err) {
    next(err);
  }
};

// @desc Login user
// @route POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account is deactivated.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: serializeUser(user),
    });
  } catch (err) {
    next(err);
  }
};

// @desc Get current logged-in user profile
// @route GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    return res.json({ success: true, user: serializeUser(user) });
  } catch (err) {
    next(err);
  }
};

// @desc Update user profile
// @route PUT /api/auth/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name.trim();
    if (phone) user.phone = phone.trim();

    await user.save();

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: serializeUser(user),
    });
  } catch (err) {
    next(err);
  }
};

// @desc Change password
// @route PUT /api/auth/change-password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};
