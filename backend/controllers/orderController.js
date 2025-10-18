// backend/controllers/orderController.js

const Order = require('../models/Order');
const Razorpay = require('razorpay');
const { v4: uuidv4 } = require('uuid');

/**
 * Lazy-initialize Razorpay client so missing envs don't crash the server at module load.
 * Returns null if keys are not configured.
 */
let razor = null;
function getRazorpayInstance() {
  if (razor) return razor;

  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    // Not throwing here so the app can start — we handle missing config at request time.
    return null;
  }

  razor = new Razorpay({
    key_id,
    key_secret
  });
  return razor;
}

/**
 * createOrder - creates a Razorpay order and saves order to DB
 */
exports.createOrder = async (req, res) => {
  try {
    const { user_id, dish_id, quantity, delivery_address } = req.body;

    if (!user_id || !dish_id || !quantity) {
      return res.status(400).json({ error: 'user_id, dish_id, quantity required' });
    }

    // amountINR calculation left as in your original code.
    const amountINR = 100 * quantity;
    // Razorpay expects amount in paise (integer).
    const options = {
      amount: amountINR * 100,
      currency: 'INR',
      receipt: `rcpt_${uuidv4()}`
    };

    const razorInstance = getRazorpayInstance();
    if (!razorInstance) {
      // Clear error so we don't expose secrets — informs client and logs for operators.
      console.error('Razorpay keys are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.');
      return res.status(500).json({ error: 'Payment provider not configured' });
    }

    const razorOrder = await razorInstance.orders.create(options);

    const order = await Order.create({
      user: user_id,
      dish: dish_id,
      quantity,
      subtotal: amountINR,
      delivery_fee: 30,
      platform_commission: Math.round(amountINR * 0.2),
      razorpay_order_id: razorOrder.id,
      order_status: 'created',
      delivery_address: delivery_address || ''
    });

    return res.json({ order_id: order._id, razorpay_order: razorOrder, amount: options.amount });
  } catch (err) {
    console.error('createOrder error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * getOrder - fetch single order by id
 */
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('dish').populate('user');
    if (!order) return res.status(404).json({ error: 'not found' });
    return res.json(order);
  } catch (err) {
    console.error('getOrder error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
