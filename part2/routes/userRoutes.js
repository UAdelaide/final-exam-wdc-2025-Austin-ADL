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
// routes/userRoutes.js（只贴 /login 部分，前后不用动）
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // —— 可选：调试用，打印客户端发来的内容
  console.log('Login attempt:', req.body);

  try {
    // 1. 只按 email 查出这条用户记录（含 password_hash）
    const [rows] = await db.query(
      `SELECT user_id, username, role, password_hash
         FROM Users
        WHERE email = ?`,
      [email]
    );

    // —— 可选：调试用，打印数据库查到的结果
    console.log('DB returned:', rows);

    // 2. 如果没查到，或密码不对，就登录失败
    if (rows.length === 0 || rows[0].password_hash !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. 登录成功，剔除 hash，写入 session，再返回给前端
    const user = {
      user_id: rows[0].user_id,
      username: rows[0].username,
      role: rows[0].role
    };
    req.session.user = user;
    res.json({ message: 'Login successful', user });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});



module.exports = router;