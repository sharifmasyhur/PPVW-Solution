const express = require('express');
const {
    login,
    register,
    getUserDetails,
    logout,
    topUp
} = require('../controllers/UserController');

const router = express.Router();

router.post('/login', async (req, res) => {
    await login(req, res);
});

router.post('/register', async (req, res) => {
    await register(req, res);
});

router.get('/:id', async (req, res) => {
    await getUserDetails(req, res);
});

router.post('/:id/topup', async (req, res) => {
    await topUp(req, res);
});

router.post('/logout', async (req, res) => {
    await logout(req, res);
});

module.exports = router;
