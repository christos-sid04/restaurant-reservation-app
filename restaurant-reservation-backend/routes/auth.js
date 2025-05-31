const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Replace this with a real secret key stored securely
const JWT_SECRET = 'your_jwt_secret_key_here';

// POST /register
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(sql, [name, email, hashedPassword], (err, result) => {
    if (err) {
      console.error(err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Email already registered.' });
      }
      return res.status(500).json({ message: 'Database error.' });
    }

    const token = jwt.sign({ user_id: result.insertId, email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully!', token });
  });
});

// POST /login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error.' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ user_id: user.user_id, email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful!', token });
  });
});

module.exports = router;
