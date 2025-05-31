const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

// POST /reservations - Create a reservation (Protected)
router.post('/reservations', authenticateToken, (req, res) => {
  const { restaurant_id, date, time, people, people_count } = req.body;
  const user_id = req.user.user_id;

  const finalPeopleCount = people_count !== undefined ? people_count : people;

  // ✅ Debug logs
  console.log('Raw request body:', req.body);
  console.log('restaurant_id:', restaurant_id);
  console.log('date:', date);
  console.log('time:', time);
  console.log('people:', people);
  console.log('people_count:', people_count);
  console.log('finalPeopleCount:', finalPeopleCount);
  console.log('user_id:', user_id);

  if (!restaurant_id || !date || !time || finalPeopleCount === undefined) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const sql = `
    INSERT INTO reservations 
    (user_id, restaurant_id, date, time, people_count) 
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [user_id, restaurant_id, date, time, finalPeopleCount], (err, result) => {
    if (err) {
      console.error('Error inserting reservation:', err);
      return res.status(500).json({ message: 'Database error.' });
    }

    res.status(201).json({
      message: 'Reservation created successfully!',
      reservation_id: result.insertId,
    });
  });
});


// GET /user/reservations - Get user's reservations (Protected)
router.get('/user/reservations', authenticateToken, (req, res) => {
  const user_id = req.user.user_id;

  const sql = `
    SELECT r.*, res.name AS restaurant_name 
    FROM reservations r 
    JOIN restaurants res ON r.restaurant_id = res.restaurant_id 
    WHERE r.user_id = ?
    ORDER BY r.date, r.time
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching reservations:', err);
      return res.status(500).json({ message: 'Database error.' });
    }

    res.status(200).json(results);
  });
});

// PUT /reservations/:id - Update a reservation (Protected)
router.put('/reservations/:id', authenticateToken, (req, res) => {
  const reservation_id = req.params.id;
  const { date, time, people_count } = req.body;
  const user_id = req.user.user_id;

  if (!date || !time || !people_count) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const sql = `
    UPDATE reservations 
    SET date = ?, time = ?, people_count = ?
    WHERE reservation_id = ? AND user_id = ?
  `;

  db.query(sql, [date, time, people_count, reservation_id, user_id], (err, result) => {
    if (err) {
      console.error('Error updating reservation:', err);
      return res.status(500).json({ message: 'Database error.' });
    }

    if (result.affectedRows === 0) {
      return res.status(403).json({ message: 'Not authorized to update this reservation.' });
    }

    res.status(200).json({ message: 'Reservation updated successfully.' });
  });
});

// DELETE /reservations/:id - Delete a reservation (Protected)
router.delete('/reservations/:id', authenticateToken, (req, res) => {
  const reservation_id = req.params.id;
  const user_id = req.user.user_id;

  const sql = `
    DELETE FROM reservations 
    WHERE reservation_id = ? AND user_id = ?
  `;

  db.query(sql, [reservation_id, user_id], (err, result) => {
    if (err) {
      console.error('Error deleting reservation:', err);
      return res.status(500).json({ message: 'Database error.' });
    }

    if (result.affectedRows === 0) {
      return res.status(403).json({ message: 'Not authorized to delete this reservation.' });
    }

    res.status(200).json({ message: 'Reservation deleted successfully.' });
  });
});

module.exports = router;
