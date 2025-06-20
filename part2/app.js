const express = require('express');
const path = require('path');
const session = require('express-session'); // ✅ 新增
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
// ✅ 加入 session 中间件
app.use(session({
  secret: 'dogwalksecret', // 可替换为更强的密钥
  resave: false,
  saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
