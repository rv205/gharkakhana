const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dishSchema = new Schema({ chef: { type: Schema.Types.ObjectId, ref: 'Chef' }, title: String, description: String, price: Number, cuisine: String, active: { type: Boolean, default: true }, createdAt: { type: Date, default: Date.now } });
module.exports = mongoose.model('Dish', dishSchema);
