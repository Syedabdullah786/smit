import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaBars, FaSignOutAlt, FaUser } from 'react-icons/fa';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-md px-6 py-4 flex justify-between items-center"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-700 hover:text-primary-600 transition-colors"
        >
          <FaBars className="text-2xl" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800">
          Inventory Management System
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-lg">
          <FaUser className="text-primary-600" />
          <div>
            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
