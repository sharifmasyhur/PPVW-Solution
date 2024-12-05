/* const pool = require('../db'); // Pastikan jalur ke konfigurasi database Anda benar

async function apiKeyMiddleware(req, res, next) {
  const apiKey = req.header('Authorization')?.split(' ')[1] || req.query.api_key;

  if (!apiKey) {
    return res.status(401).json({ error: "API Key is missing" });
  }

  try {
    const result = await pool.query('SELECT * FROM api_keys WHERE api_key = $1', [apiKey]);
    if (result.rowCount === 0) {
      return res.status(403).json({ error: "Invalid API Key" });
    }

    // Jika valid, lanjutkan ke middleware berikutnya
    next();
  } catch (err) {
    console.error('Error in API Key middleware:', err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = apiKeyMiddleware;
*/ 