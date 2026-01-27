import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaHome,
  FaShoppingCart,
  FaMoneyBillWave,
  FaShoppingBag,
  FaUsers,
  FaUserShield,
  FaFileInvoiceDollar,
  FaChartLine,
  FaBoxes,
  FaTruck,
  FaFileAlt,
  FaUserTie,
} from 'react-icons/fa';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FaHome },
    { name: 'Sales', path: '/sales', icon: FaShoppingCart },
    { name: 'Purchase', path: '/purchase', icon: FaShoppingBag },
    { name: 'Expenses', path: '/expenses', icon: FaMoneyBillWave },
    { name: 'Inventory', path: '/inventory', icon: FaBoxes },
    { name: 'Customers', path: '/customers', icon: FaUsers },
    { name: 'Vendors', path: '/vendors', icon: FaTruck },
    { name: 'Customer Balance', path: '/customer-balance', icon: FaFileInvoiceDollar },
    { name: 'Vendor Balance', path: '/vendor-balance', icon: FaFileInvoiceDollar },
    { name: 'All Invoices', path: '/invoices', icon: FaFileAlt },
    { name: 'Today Recovery', path: '/recovery', icon: FaChartLine },
    { name: 'Employees', path: '/employees', icon: FaUserTie },
    { name: 'Admin', path: '/admin', icon: FaUserShield },
  ];

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-gradient-to-b from-primary-800 to-primary-900 text-white h-screen fixed left-0 top-0 transition-all duration-300 shadow-2xl z-50`}
    >
      <div className="p-6">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-2xl font-bold mb-8 ${!isOpen && 'hidden'}`}
        >
          AHMED TRADERS
        </motion.h1>
        {!isOpen && (
          <h1 className="text-xl font-bold mb-8 text-center">AT</h1>
        )}
      </div>

      <nav className="px-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link key={index} to={item.path}>
              <motion.div
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className={`sidebar-link mb-2 ${
                  isActive ? 'sidebar-link-active' : ''
                }`}
              >
                <Icon className="text-xl flex-shrink-0" />
                {isOpen && <span className="text-sm font-medium">{item.name}</span>}
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </motion.div>
  );
};

export default Sidebar;
