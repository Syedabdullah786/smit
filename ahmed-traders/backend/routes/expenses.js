const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate('createdBy', 'name')
      .sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate('createdBy', 'name');
    if (expense) {
      res.json(expense);
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      createdBy: req.user._id
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (expense) {
      res.json(expense);
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (expense) {
      res.json({ message: 'Expense deleted' });
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
