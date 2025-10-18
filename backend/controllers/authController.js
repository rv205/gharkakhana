const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
exports.register = async (req, res) => {
  const { name, phone, password, role } = req.body;
  if (!phone || !name || !password) return res.status(400).json({ error: 'name, phone, password required' });
  const existing = await User.findOne({ phone });
  if (existing) return res.status(400).json({ error: 'user exists' });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, phone, password: hash, role: role || 'customer' });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'dev_secret');
  res.json({ token, user: { id: user._id, name: user.name, phone: user.phone } });
};
exports.login = async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) return res.status(400).json({ error: 'phone and password required' });
  const user = await User.findOne({ phone });
  if (!user) return res.status(400).json({ error: 'invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: 'invalid credentials' });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'dev_secret');
  res.json({ token, user: { id: user._id, name: user.name, phone: user.phone } });
};
