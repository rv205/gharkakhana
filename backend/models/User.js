const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({ name: String, phone: { type: String, unique: true }, password: String, role: { type: String, enum: ['customer','chef','admin'], default: 'customer' }, createdAt: { type: Date, default: Date.now } });
module.exports = mongoose.model('User', userSchema);
