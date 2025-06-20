const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});

// POST login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. 只用 email 查出用户及其 password_hash
    const [rows] = await db.query(
      `SELECT user_id, username, role, password_hash
         FROM Users
        WHERE email = ?`,
      [email]
    );

    // 2. 如果没查到，或密码不匹配，则返回 401
    if (rows.length === 0 || rows[0].password_hash !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. 登陆成功：组装 user 对象，写入 session，返回结果
    const user = {
      user_id: rows[0].user_id,
      username: rows[0].username,
      role: rows[0].role
    };
    req.session.user = user;

    res.json({ message: 'Login successful', user });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});



module.exports = router;