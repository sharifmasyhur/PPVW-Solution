const express = require('express');
const {
    getUserDonation,
    addDonation
} = require('../controllers/DonationController');

const router = express.Router();

// Define routes with proper HTTP methods and path names
router.get('/:id', async (req, res) => {
    await getUserDonation(req, res); // Fetch total donation
});

router.post('/:id/add', async (req, res) => {
    await addDonation(req, res); //make donation
});


module.exports = router;
