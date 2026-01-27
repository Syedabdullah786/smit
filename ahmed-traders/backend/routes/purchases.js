const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate('vendor', 'name phone')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate('vendor')
      .populate('items.product')
      .populate('createdBy', 'name');
    if (purchase) {
      res.json(purchase);
    } else {
      res.status(404).json({ message: 'Purchase not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { vendor, items, subtotal, tax, total, paid, paymentMethod, notes } = req.body;

    const lastPurchase = await Purchase.findOne().sort({ createdAt: -1 });
    let purchaseNumber = 'PUR-0001';
    if (lastPurchase) {
      const lastNumber = parseInt(lastPurchase.purchaseNumber.split('-')[1]);
      purchaseNumber = `PUR-${String(lastNumber + 1).padStart(4, '0')}`;
    }

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    const balance = total - paid;
    
    const purchase = await Purchase.create({
      purchaseNumber,
      vendor,
      items,
      subtotal,
      tax,
      total,
      paid,
      balance,
      paymentMethod,
      notes,
      createdBy: req.user._id
    });

    if (balance > 0) {
      const vendorDoc = await Vendor.findById(vendor);
      if (vendorDoc) {
        vendorDoc.balance += balance;
        await vendorDoc.save();
      }
    }

    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (purchase) {
      res.json(purchase);
    } else {
      res.status(404).json({ message: 'Purchase not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);
    if (purchase) {
      res.json({ message: 'Purchase deleted' });
    } else {
      res.status(404).json({ message: 'Purchase not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
