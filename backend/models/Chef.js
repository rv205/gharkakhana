const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chefSchema = new Schema({ name: String, phone: String, city: String, kitchen_name: String, cuisine: String, about: String, verified: { type: Boolean, default: false }, createdAt: { type: Date, default: Date.now } });
module.exports = mongoose.model('Chef', chefSchema);
