const Order = require('../models/Order');
const Razorpay = require('razorpay');
const { v4: uuidv4 } = require('uuid');
const razor = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID || '', key_secret: process.env.RAZORPAY_KEY_SECRET || '' });
exports.createOrder = async (req, res) => {
  const { user_id, dish_id, quantity, delivery_address } = req.body;
  if (!user_id || !dish_id || !quantity) return res.status(400).json({ error: 'user_id, dish_id, quantity required' });
  const amountINR = 100 * quantity;
  const options = { amount: amountINR * 100, currency: "INR", receipt: `rcpt_${uuidv4()}` };
  const razorOrder = await razor.orders.create(options);
  const order = await Order.create({ user: user_id, dish: dish_id, quantity, subtotal: amountINR, delivery_fee: 30, platform_commission: Math.round(amountINR * 0.20), razorpay_order_id: razorOrder.id, order_status: 'created' });
  res.json({ order_id: order._id, razorpay_order: razorOrder, amount: options.amount });
};
exports.getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('dish').populate('user');
  if (!order) return res.status(404).json({ error: 'not found' });
  res.json(order);
};
