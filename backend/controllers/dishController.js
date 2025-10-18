const Dish = require('../models/Dish');
exports.createDish = async (req, res) => {
  const { chef_id, title, description, price, cuisine } = req.body;
  if (!chef_id || !title || !price) return res.status(400).json({ error: 'chef_id, title, price required' });
  const dish = await Dish.create({ chef: chef_id, title, description, price, cuisine });
  res.json(dish);
};
exports.listDishes = async (req, res) => {
  const dishes = await Dish.find({}).limit(500).populate('chef', 'name kitchen_name city');
  res.json(dishes);
};
