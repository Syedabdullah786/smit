const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  partNumber: {
    type: String,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  unit: {
    type: String,
    default: 'pcs',
    trim: true
  },
  purchasePrice: {
    type: Number,
    required: true,
    default: 0
  },
  salePrice: {
    type: Number,
    required: true,
    default: 0
  },
  stock: {
    type: Number,
    default: 0
  },
  minStock: {
    type: Number,
    default: 10
  },
  location: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
