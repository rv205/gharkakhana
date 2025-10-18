const express = require('express');
const router = express.Router();
const crypto = require('crypto');
router.post('/razorpay', express.raw({ type: 'application/json' }), (req, res) => {
  const secret = process.env.WEBHOOK_SECRET || '';
  const signature = req.headers['x-razorpay-signature'];
  if (secret) {
    const expected = crypto.createHmac('sha256', secret).update(req.body).digest('hex');
    if (expected !== signature) {
      console.warn('Invalid webhook signature');
      return res.status(400).send('Invalid signature');
    }
  }
  const payload = JSON.parse(req.body.toString());
  console.log('Received webhook:', payload.event);
  res.status(200).send('OK');
});
module.exports = router;
