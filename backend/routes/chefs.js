const express = require('express');
const router = express.Router();
const { applyChef, listChefs, getChef } = require('../controllers/chefController');
router.post('/apply', applyChef);
router.get('/', listChefs);
router.get('/:id', getChef);
module.exports = router;
