const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderSchema = new Schema({ user: { type: Schema.Types.ObjectId, ref: 'User' }, chef: { type: Schema.Types.ObjectId, ref: 'Chef' }, dish: { type: Schema.Types.ObjectId, ref: 'Dish' }, quantity: Number, subtotal: Number, delivery_fee: Number, platform_commission: Number, razorpay_order_id: String, order_status: String, createdAt: { type: Date, default: Date.now } });
module.exports = mongoose.model('Order', orderSchema);
