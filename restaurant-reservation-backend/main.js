const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const db = require('./db');
const authRoutes = require('./routes/auth');
const reservationRoutes = require('./routes/reservations');
const restaurantRoutes = require('./routes/restaurants'); // original import

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mount routers
app.use('/api', authRoutes);
app.use('/api', reservationRoutes);
app.use('/api', restaurantRoutes); // mount restaurant routes here

// Test route
app.get('/', (req, res) => {
  res.send('🍽️ Restaurant Reservation API is running!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
