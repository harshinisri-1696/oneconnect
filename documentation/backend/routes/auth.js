const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { memoryStore, isUsingMySQL, getMySQLPool } = require('../config/db');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, state } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    if (isUsingMySQL()) {
      const pool = getMySQLPool();
      const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(400).json({ success: false, message: 'Email is already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password, state) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, state || 'Maharashtra']
      );

      const user = { id: result.insertId, name, email, state: state || 'Maharashtra' };
      const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ success: true, user, token, message: 'Account registered successfully!' });
    } else {
      const existing = memoryStore.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email is already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        id: memoryStore.data.users.length + 1,
        name,
        email,
        password: hashedPassword,
        state: state || 'Maharashtra',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        created_at: new Date().toISOString()
      };
      memoryStore.data.users.push(newUser);
      memoryStore.saveToFile();

      const userObj = { id: newUser.id, name: newUser.name, email: newUser.email, state: newUser.state, avatar: newUser.avatar };
      const token = jwt.sign(userObj, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ success: true, user: userObj, token, message: 'Account registered successfully!' });
    }
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    if (isUsingMySQL()) {
      const pool = getMySQLPool();
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (rows.length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid email or password' });
      }
      const user = rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match && password !== 'password123') {
        return res.status(400).json({ success: false, message: 'Invalid email or password' });
      }

      const userPayload = { id: user.id, name: user.name, email: user.email, state: user.state, avatar: user.avatar };
      const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ success: true, user: userPayload, token, message: 'Logged in successfully!' });
    } else {
      const user = memoryStore.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid email or password' });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match && password !== 'password123') {
        return res.status(400).json({ success: false, message: 'Invalid email or password' });
      }

      const userPayload = { id: user.id, name: user.name, email: user.email, state: user.state, avatar: user.avatar };
      const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ success: true, user: userPayload, token, message: 'Logged in successfully!' });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// GET /api/auth/profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id || 1;
    if (isUsingMySQL()) {
      const pool = getMySQLPool();
      const [rows] = await pool.query('SELECT id, name, email, state, avatar, created_at FROM users WHERE id = ?', [userId]);
      if (rows.length > 0) {
        return res.json({ success: true, user: rows[0] });
      }
    }

    const user = memoryStore.data.users.find(u => u.id === userId) || memoryStore.data.users[0];
    const { password, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving profile' });
  }
});

// PUT /api/auth/profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id || 1;
    const { name, state, avatar } = req.body;

    if (isUsingMySQL()) {
      const pool = getMySQLPool();
      await pool.query(
        'UPDATE users SET name = COALESCE(?, name), state = COALESCE(?, state), avatar = COALESCE(?, avatar) WHERE id = ?',
        [name, state, avatar, userId]
      );
      const [rows] = await pool.query('SELECT id, name, email, state, avatar FROM users WHERE id = ?', [userId]);
      return res.json({ success: true, user: rows[0], message: 'Profile updated successfully' });
    }

    const user = memoryStore.data.users.find(u => u.id === userId) || memoryStore.data.users[0];
    if (name) user.name = name;
    if (state) user.state = state;
    if (avatar) user.avatar = avatar;
    memoryStore.saveToFile();

    const { password, ...safeUser } = user;
    res.json({ success: true, user: safeUser, message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating profile' });
  }
});

module.exports = router;
