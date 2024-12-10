const express = require('express');
const {
  login,
  register,
  getUserDetails,
  logout,
  topUp,
} = require('../controllers/UserController');

const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

const router = express.Router();

router.post('/login', csrfProtection, async (req, res) => {
  await login(req, res);
});

router.post('/register', csrfProtection, async (req, res) => {
  await register(req, res);
});

router.get('/:id', async (req, res) => {
  await getUserDetails(req, res);
});

router.post('/:id/topup', csrfProtection, async (req, res) => {
  await topUp(req, res);
});

router.post('/logout', csrfProtection, async (req, res) => {
  await logout(req, res);
});

module.exports = router;
