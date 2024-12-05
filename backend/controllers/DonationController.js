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

// Logging dalam kasus kesalahan
// logger.error('Failed payment attempt:', { userId: req.user.id, error });

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

const getUserDonation = async (req, res) => {
    const { id } = req.params; // User ID

    try {
        // Fetch the donation amount for the user with the given ID
        const result = await pool.query(
            'SELECT donation FROM users WHERE id = $1',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const donation = result.rows[0].donation;

        res.status(200).json({
            message: "User donation retrieved successfully",
            donation: donation
        });
    } catch (error) {
        console.error('Error fetching donation:', error);
        res.status(500).json({ error: "An error occurred while retrieving donation" });
    }
};

// async function addDonation(req, res) {
//     const { id } = req.params; // Extract user ID from the request parameters
//     const { amount } = req.body; // Extract the amount to be added to the donation

//     // Validate amount
//     if (typeof amount !== 'number' || amount <= 0) {
//         return res.status(400).json({ error: "Invalid amount. It must be a positive number." });
//     }

//     try {
//         // Update the user's donation
//         const result = await pool.query(
//             `UPDATE users 
//             SET balance = balance - $1, 
//                 donation = donation + $2
//             WHERE id = $3 
//             RETURNING balance, donation`,
//             [amount, id] // Use the donation amount and user ID in the query
//         );

//         if (result.rowCount === 0) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         const updatedDonation = result.rows[0].donation;

//         res.status(200).json({
//             message: "User donation updated successfully",
//             donation: updatedDonation
//         });
//     } catch (error) {
//         console.error('Error updating user donation:', error);
//         res.status(500).json({ error: "An error occurred while updating the donation" });
//     }
// };

async function addDonation(req, res) {
    const { id } = req.params; // Extract user ID from the request parameters
    const { amount } = req.body; // Extract the amount to be donated

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount. It must be a positive number." });
    }

    try {
        // Start a transaction to ensure both fields are updated atomically
        await pool.query('BEGIN');
        
        // Get current balance to ensure it's enough for the donation
        const balanceResult = await pool.query(
            'SELECT balance FROM users WHERE id = $1',
            [id]
        );

        if (balanceResult.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const currentBalance = balanceResult.rows[0].balance;

        // Ensure the user has enough balance to make the donation
        if (currentBalance < amount) {
            return res.status(400).json({ error: "Insufficient balance for donation" });
        }

        // Update the user's balance and donation fields
        const result = await pool.query(
            `UPDATE users 
            SET balance = balance - $1, 
                donation = donation + $2
            WHERE id = $3 
            RETURNING balance, donation`,
            [amount, amount, id] // Subtract amount from balance and add to donation
        );

        if (result.rowCount === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ error: "User not found" });
        }

        const updatedBalance = result.rows[0].balance;
        const updatedDonation = result.rows[0].donation;

        // Commit transaction
        await pool.query('COMMIT');

        res.status(200).json({
            message: "Donation successful. Balance and donation updated.",
            balance: updatedBalance,
            donation: updatedDonation
        });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error making donation:', error);
        res.status(500).json({ error: "An error occurred while making the donation" });
    }
}

/* async function apiKeyMiddleware(req, res, next) {
    const apiKey = req.header('Authorization')?.split(' ')[1] || req.query.api_key;

    if (!apiKey) {
        return res.status(401).json({ error: "API Key is missing" });
    }

    const result = await pool.query('SELECT * FROM api_keys WHERE api_key = $1', [apiKey]);
    if (result.rowCount === 0) {
        return res.status(403).json({ error: "Invalid API Key" });
    }

    next();
}
 */

module.exports = { getUserDonation, addDonation, };

