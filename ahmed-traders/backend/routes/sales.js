const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('customer', 'name phone')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/today', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sales = await Sale.find({
      createdAt: { $gte: today, $lt: tomorrow }
    }).populate('customer', 'name');
    
    const total = sales.reduce((sum, sale) => sum + sale.total, 0);
    const paid = sales.reduce((sum, sale) => sum + sale.paid, 0);
    
    res.json({ sales, total, paid, count: sales.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('customer')
      .populate('items.product')
      .populate('createdBy', 'name');
    if (sale) {
      res.json(sale);
    } else {
      res.status(404).json({ message: 'Sale not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { customer, items, subtotal, tax, discount, total, paid, paymentMethod, notes } = req.body;

    const lastSale = await Sale.findOne().sort({ createdAt: -1 });
    let invoiceNumber = 'INV-0001';
    if (lastSale) {
      const lastNumber = parseInt(lastSale.invoiceNumber.split('-')[1]);
      invoiceNumber = `INV-${String(lastNumber + 1).padStart(4, '0')}`;
    }

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    const balance = total - paid;
    
    const sale = await Sale.create({
      invoiceNumber,
      customer,
      items,
      subtotal,
      tax,
      discount,
      total,
      paid,
      balance,
      paymentMethod,
      notes,
      createdBy: req.user._id
    });

    if (balance > 0) {
      const customerDoc = await Customer.findById(customer);
      if (customerDoc) {
        customerDoc.balance += balance;
        await customerDoc.save();
      }
    }

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (sale) {
      res.json(sale);
    } else {
      res.status(404).json({ message: 'Sale not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (sale) {
      res.json({ message: 'Sale deleted' });
    } else {
      res.status(404).json({ message: 'Sale not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
