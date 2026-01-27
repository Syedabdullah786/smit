const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/vendors', require('./routes/vendors'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/purchases', require('./routes/purchases'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/dashboard', require('./routes/dashboard'));

app.get('/', (req, res) => {
  res.json({ message: 'Ahmed Traders API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
