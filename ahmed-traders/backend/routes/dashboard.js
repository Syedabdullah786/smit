const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Purchase = require('../models/Purchase');
const Expense = require('../models/Expense');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Vendor = require('../models/Vendor');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const todaySales = await Sale.find({ createdAt: { $gte: today, $lt: tomorrow } });
    const todayPurchases = await Purchase.find({ createdAt: { $gte: today, $lt: tomorrow } });
    const todayExpenses = await Expense.find({ date: { $gte: today, $lt: tomorrow } });

    const monthSales = await Sale.find({ createdAt: { $gte: thisMonth, $lt: nextMonth } });
    const monthPurchases = await Purchase.find({ createdAt: { $gte: thisMonth, $lt: nextMonth } });
    const monthExpenses = await Expense.find({ date: { $gte: thisMonth, $lt: nextMonth } });

    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.countDocuments({ $expr: { $lte: ['$stock', '$minStock'] } });
    const totalCustomers = await Customer.countDocuments();
    const totalVendors = await Vendor.countDocuments();

    const customerBalances = await Customer.find({ balance: { $gt: 0 } });
    const vendorBalances = await Vendor.find({ balance: { $gt: 0 } });

    const todaySalesTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    const todayRecovery = todaySales.reduce((sum, sale) => sum + sale.paid, 0);
    const todayPurchasesTotal = todayPurchases.reduce((sum, purchase) => sum + purchase.total, 0);
    const todayExpensesTotal = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    const monthSalesTotal = monthSales.reduce((sum, sale) => sum + sale.total, 0);
    const monthPurchasesTotal = monthPurchases.reduce((sum, purchase) => sum + purchase.total, 0);
    const monthExpensesTotal = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    const totalCustomerBalance = customerBalances.reduce((sum, customer) => sum + customer.balance, 0);
    const totalVendorBalance = vendorBalances.reduce((sum, vendor) => sum + vendor.balance, 0);

    res.json({
      today: {
        sales: todaySalesTotal,
        recovery: todayRecovery,
        purchases: todayPurchasesTotal,
        expenses: todayExpensesTotal,
        profit: todaySalesTotal - todayPurchasesTotal - todayExpensesTotal
      },
      month: {
        sales: monthSalesTotal,
        purchases: monthPurchasesTotal,
        expenses: monthExpensesTotal,
        profit: monthSalesTotal - monthPurchasesTotal - monthExpensesTotal
      },
      inventory: {
        totalProducts,
        lowStockProducts
      },
      balances: {
        customers: totalCustomerBalance,
        vendors: totalVendorBalance
      },
      counts: {
        customers: totalCustomers,
        vendors: totalVendors
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/charts', protect, async (req, res) => {
  try {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const sales = await Sale.find({ createdAt: { $gte: last7Days } });
    const purchases = await Purchase.find({ createdAt: { $gte: last7Days } });
    const expenses = await Expense.find({ date: { $gte: last7Days } });

    const salesByDay = {};
    const purchasesByDay = {};
    const expensesByDay = {};

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      salesByDay[dateStr] = 0;
      purchasesByDay[dateStr] = 0;
      expensesByDay[dateStr] = 0;
    }

    sales.forEach(sale => {
      const dateStr = sale.createdAt.toISOString().split('T')[0];
      if (salesByDay[dateStr] !== undefined) {
        salesByDay[dateStr] += sale.total;
      }
    });

    purchases.forEach(purchase => {
      const dateStr = purchase.createdAt.toISOString().split('T')[0];
      if (purchasesByDay[dateStr] !== undefined) {
        purchasesByDay[dateStr] += purchase.total;
      }
    });

    expenses.forEach(expense => {
      const dateStr = expense.date.toISOString().split('T')[0];
      if (expensesByDay[dateStr] !== undefined) {
        expensesByDay[dateStr] += expense.amount;
      }
    });

    const chartData = Object.keys(salesByDay).reverse().map(date => ({
      date,
      sales: salesByDay[date],
      purchases: purchasesByDay[date],
      expenses: expensesByDay[date]
    }));

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
