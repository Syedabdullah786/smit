import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboardAPI } from '../utils/api';
import { FaMoneyBillWave, FaShoppingCart, FaBoxes, FaUsers, FaChartLine, FaExclamationTriangle } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, chartsRes] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getCharts(),
      ]);
      setStats(statsRes.data);
      setChartData(chartsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Today Sales',
      value: `Rs. ${stats?.today?.sales?.toLocaleString() || 0}`,
      icon: FaShoppingCart,
      color: 'bg-green-500',
      change: '+12%',
    },
    {
      title: 'Today Recovery',
      value: `Rs. ${stats?.today?.recovery?.toLocaleString() || 0}`,
      icon: FaMoneyBillWave,
      color: 'bg-blue-500',
      change: '+8%',
    },
    {
      title: 'Today Expenses',
      value: `Rs. ${stats?.today?.expenses?.toLocaleString() || 0}`,
      icon: FaChartLine,
      color: 'bg-red-500',
      change: '-5%',
    },
    {
      title: 'Today Profit',
      value: `Rs. ${stats?.today?.profit?.toLocaleString() || 0}`,
      icon: FaMoneyBillWave,
      color: 'bg-purple-500',
      change: '+15%',
    },
    {
      title: 'Total Products',
      value: stats?.inventory?.totalProducts || 0,
      icon: FaBoxes,
      color: 'bg-yellow-500',
      change: '+3',
    },
    {
      title: 'Low Stock Items',
      value: stats?.inventory?.lowStockProducts || 0,
      icon: FaExclamationTriangle,
      color: 'bg-orange-500',
      change: 'Alert',
    },
    {
      title: 'Customer Balance',
      value: `Rs. ${stats?.balances?.customers?.toLocaleString() || 0}`,
      icon: FaUsers,
      color: 'bg-indigo-500',
      change: 'Receivable',
    },
    {
      title: 'Vendor Balance',
      value: `Rs. ${stats?.balances?.vendors?.toLocaleString() || 0}`,
      icon: FaUsers,
      color: 'bg-pink-500',
      change: 'Payable',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to Ahmed Traders Management System</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-2">{card.value}</h3>
                  <p className="text-sm text-green-600 mt-1">{card.change}</p>
                </div>
                <div className={`${card.color} p-4 rounded-full`}>
                  <Icon className="text-white text-2xl" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Sales vs Purchases (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="purchases" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Revenue Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#3b82f6" />
              <Bar dataKey="expenses" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-700 font-semibold">Total Sales</p>
            <p className="text-2xl font-bold text-green-800">Rs. {stats?.month?.sales?.toLocaleString() || 0}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-700 font-semibold">Total Purchases</p>
            <p className="text-2xl font-bold text-red-800">Rs. {stats?.month?.purchases?.toLocaleString() || 0}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-700 font-semibold">Total Expenses</p>
            <p className="text-2xl font-bold text-yellow-800">Rs. {stats?.month?.expenses?.toLocaleString() || 0}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-purple-700 font-semibold">Net Profit</p>
            <p className="text-2xl font-bold text-purple-800">Rs. {stats?.month?.profit?.toLocaleString() || 0}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
