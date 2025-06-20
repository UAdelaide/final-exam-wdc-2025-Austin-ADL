const express = require('express');
const router = express.Router();
const db = require('../models/db');

// 获取所有狗狗信息的端点
router.get('/', async (req, res) => {
  try {
    // 只查询狗狗ID和名字
    const [rows] = await db.query('SELECT dog_id, name FROM Dogs');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching dogs:', error);
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

module.exports = router;