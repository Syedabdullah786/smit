const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank', 'cheque'],
    default: 'cash'
  },
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

module.exports = mongoose.model('Expense', expenseSchema);
