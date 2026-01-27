const mongoose = require('mongoose');

const purchaseItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: String,
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
});

const purchaseSchema = new mongoose.Schema({
  purchaseNumber: {
    type: String,
    required: true,
    unique: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  items: [purchaseItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  paid: {
    type: Number,
    default: 0
  },
  balance: {
    type: Number,
    default: 0
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit', 'bank', 'cheque'],
    default: 'cash'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'completed'
  },
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Purchase', purchaseSchema);
