// server/app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const pool = require('./db');
// const { v4: uuidv4 } = require('uuid');

// Import routes
const userRoutes = require('./routes/UserRoute');
const transactionRoutes = require('./routes/TransactionRoute');
const reportRoutes = require('./routes/ReportRoute');
const donationRoutes = require('./routes/DonationRoute');

// const apiKeyMiddleware = require('./middlewares/apiKeyMiddleware'); // Tambahkan middleware API Key

const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Adjust origin as needed
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(csrf({ cookie: true })); // CSRF middleware

/* async function generateApiKey() {
  const apiKey = uuidv4(); // Generate API Key unik
  try {
    await pool.query('INSERT INTO api_keys (api_key) VALUES ($1)', [apiKey]);
    console.log('API Key created:', apiKey);
  } catch (err) {
    console.error('Error generating API Key:', err);
  }
}

generateApiKey();
*/ 


// CSRF protection
const csrfProtection = csrf({ cookie: true });

// Routes
app.use('/users', csrfProtection, userRoutes);
app.use('/transaction', transactionRoutes);
app.use('/report', reportRoutes);
app.use('/donation', donationRoutes);

// CSRF Token Endpoint
app.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});



// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
