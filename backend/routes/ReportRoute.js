const express = require('express');
const {
    getTotalIncome, 
    getTotalExpenses, 
    getFinanceHealthScore 
} = require('../controllers/ReportController');

const router = express.Router();

// Define routes with proper HTTP methods and path names
router.get('/:id/income', async (req, res) => {
    await getTotalIncome(req, res); // Fetch total income
});

router.get('/:id/expenses', async (req, res) => {
    await getTotalExpenses(req, res); // Fetch total expenses
});

router.get('/:id/score', async (req, res) => {
    await getFinanceHealthScore(req, res); // Fetch financial health score
});

module.exports = router;
