const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const adminEmail = (process.env.ADMIN_EMAIL || 'pratiknerpagar2@gmail.com').toLowerCase();
    const role = email.toLowerCase() === adminEmail ? 'admin' : 'user';
    const user = await User.create({ name, email: email.toLowerCase(), passwordHash, role });

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role || role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role || role },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const adminEmail = (process.env.ADMIN_EMAIL || 'pratiknerpagar2@gmail.com').toLowerCase();
    const role = user.role || (user.email.toLowerCase() === adminEmail ? 'admin' : 'user');
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// GET /api/auth/me — verify token & return user
router.get('/me', require('../middleware/authMiddleware'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    const adminEmail = (process.env.ADMIN_EMAIL || 'pratiknerpagar2@gmail.com').toLowerCase();
    const role = user.role || (user.email.toLowerCase() === adminEmail ? 'admin' : 'user');
    res.json({ user: { id: user._id, name: user.name, email: user.email, role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
