const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Ana sayfa route'u
app.get('/', (req, res) => {
  res.send('İstanbul Guide API çalışıyor!');
});

// Port tanımlama
const PORT = process.env.PORT || 3000;

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});