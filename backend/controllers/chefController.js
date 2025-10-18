const Chef = require('../models/Chef');
exports.applyChef = async (req, res) => {
  const { name, phone, city, kitchen_name, cuisine, about } = req.body;
  if (!name || !phone || !city) return res.status(400).json({ error: 'name, phone, city required' });
  const chef = await Chef.create({ name, phone, city, kitchen_name, cuisine, about });
  res.json({ chef });
};
exports.listChefs = async (req, res) => {
  const chefs = await Chef.find({ verified: true }).limit(200);
  res.json(chefs);
};
exports.getChef = async (req, res) => {
  const chef = await Chef.findById(req.params.id);
  if (!chef) return res.status(404).json({ error: 'not found' });
  res.json(chef);
};
