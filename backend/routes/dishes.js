const express = require('express');
const router = express.Router();
const { createDish, listDishes } = require('../controllers/dishController');
router.post('/', createDish);
router.get('/', listDishes);
module.exports = router;
