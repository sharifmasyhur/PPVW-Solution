const express = require('express');
const {
  payment,
  history,
  historyByType,
} = require('../controllers/TransactionController');

const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

const router = express.Router();

router.post('/:id/payment', csrfProtection, async (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  await payment(req, res);
});

router.get('/:id/history', async (req, res) => {
  await history(req, res);
});

router.get('/:id/history/type', async (req, res) => {
  await historyByType(req, res);
});

module.exports = router;
