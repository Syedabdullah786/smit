const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['received', 'paid'],
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank', 'cheque'],
    default: 'cash'
  },
  reference: {
    type: String,
    trim: true
  },
  notes: String,
  date: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
