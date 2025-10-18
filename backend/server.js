require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('express-async-errors');
const routes = require('./routes');
const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gharkakhana_dev';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=>console.log('Connected to MongoDB'))
  .catch(err=>console.error('MongoDB connection error:', err.message));
app.use('/api', routes);
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ error: err.message || 'Internal Server Error' }); });
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log('Server running on port', PORT));
