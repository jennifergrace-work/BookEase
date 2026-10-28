const User = require('../models/User');
const { serializeUser } = require('../utils/serializers');

// @desc Get all users (Admin)
// @route GET /api/users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json({ success: true, count: users.length, data: users.map(serializeUser) });
  } catch (err) {
    next(err);
  }
};

// @desc Create user (Admin)
// @route POST /api/users
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, isActive } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email address already in use' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: role || 'User',
      isActive: isActive !== false,
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: serializeUser(user),
    });
  } catch (err) {
    next(err);
  }
};

// @desc Update user (Admin)
// @route PUT /api/users/:id
exports.updateUser = async (req, res, next) => {
  try {
    const { name, phone, role, isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name.trim();
    if (phone) user.phone = phone.trim();
    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;

    await user.save();

    return res.json({
      success: true,
      message: 'User updated successfully',
      data: serializeUser(user),
    });
  } catch (err) {
    next(err);
  }
};

// @desc Delete user (Admin)
// @route DELETE /api/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.email === 'admin@bookease.com') {
      return res.status(400).json({ success: false, message: 'Primary administrative account cannot be deleted' });
    }

    await User.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'User removed successfully' });
  } catch (err) {
    next(err);
  }
};
