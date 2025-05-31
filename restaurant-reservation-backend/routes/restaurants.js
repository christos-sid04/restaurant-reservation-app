const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/restaurants - return list of restaurants
router.get('/restaurants', (req, res) => {
  const sql = 'SELECT * FROM restaurants';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching restaurants:', err);
      return res.status(500).json({ message: 'Failed to load restaurants.' });
    }

    res.status(200).json(results);
  });
});

module.exports = router;
