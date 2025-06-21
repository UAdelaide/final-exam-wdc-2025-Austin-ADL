const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

app.get('/owner-dashboard', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'owner') {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, 'public/owner-dashboard.html'));
});

app.get('/walker-dashboard', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'walker') {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, 'public/walker-dashboard.html'));
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});
const dogRoutes = require('./routes/dogRoutes');
app.use('/api/dogs', dogRoutes);

module.exports = app;