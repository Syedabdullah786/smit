const mongoose = require('mongoose');

const challanItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  productName: String,
  quantity: {
    type: Number,
    required: true
  }
});

const deliveryChallanSchema = new mongoose.Schema({
  challanNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  items: [challanItemSchema],
  deliveryDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'delivered', 'cancelled'],
    default: 'pending'
  },
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DeliveryChallan', deliveryChallanSchema);
