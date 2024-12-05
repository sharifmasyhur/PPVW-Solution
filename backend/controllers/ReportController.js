const pool = require('../db');
const bcrypt = require('bcrypt');
const winston = require('winston');
const { v4: uuidv4 } = require('uuid');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.Console({ format: winston.format.simple() })
    ]
});

async function generateApiKey() {
    const apiKey = uuidv4(); // Generate API Key unik
    try {
      await pool.query('INSERT INTO api_keys (api_key) VALUES ($1)', [apiKey]);
      console.log('API Key created:', apiKey);
    } catch (err) {
      console.error('Error generating API Key:', err);
    }
  }
  
  generateApiKey();

// Logging dalam kasus kesalahan
// logger.error('Failed payment attempt:', { userId: req.user.id, error });

const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: "Token is required" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.user = user; // Menyimpan informasi pengguna
        next();
    });
}

const getTotalIncome = async (req, res) => {
    const { id } = req.params; // User ID

    try {
        const result = await pool.query(
            'SELECT income FROM users WHERE id = $1',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const totalIncome = result.rows[0].income;
        res.status(200).json({ message: "Total income retrieved", total_income: totalIncome });
    } catch (error) {
        console.error('Error fetching total income:', error);
        res.status(500).json({ error: "An error occurred while retrieving total income" });
    }
};


const getTotalExpenses = async (req, res) => {
    const { id } = req.params; // User ID

    try {
        const result = await pool.query(
            'SELECT expense FROM users WHERE id = $1',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const totalExpenses = result.rows[0].expense;
        res.status(200).json({ message: "Total expenses retrieved", total_expenses: totalExpenses });
    } catch (error) {
        console.error('Error fetching total expenses:', error);
        res.status(500).json({ error: "An error occurred while retrieving total expenses" });
    }
};

const getFinanceHealthScore = async (req, res) => {
    const { id } = req.params; // User ID

    try {
        // Fetch user income and expense
        const result = await pool.query(
            'SELECT income, expense FROM users WHERE id = $1',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const { income, expense } = result.rows[0];

        if (income === 0) {
            return res.status(400).json({ error: "Cannot calculate score with zero income" });
        }

        // Calculate financial health score
        let score = ((income - expense) / income) * 100;

        // Clamp the score to a range of 0% to 100%
        score = Math.min(100, Math.max(0, score));

        res.status(200).json({ message: "Financial health score calculated", score: score.toFixed(2) });
    } catch (error) {
        console.error('Error calculating financial health score:', error);
        res.status(500).json({ error: "An error occurred while calculating the score" });
    }
};

module.exports = { getTotalExpenses, getTotalIncome, getFinanceHealthScore };
