import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { salesAPI, customersAPI, productsAPI } from '../utils/api';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    customer: '',
    items: [{ product: '', quantity: 1, price: 0 }],
    tax: 0,
    discount: 0,
    paid: 0,
    paymentMethod: 'cash',
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [salesRes, customersRes, productsRes] = await Promise.all([
        salesAPI.getAll(),
        customersAPI.getAll(),
        productsAPI.getAll(),
      ]);
      setSales(salesRes.data);
      setCustomers(customersRes.data);
      setProducts(productsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product: '', quantity: 1, price: 0 }],
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    if (field === 'product') {
      const product = products.find((p) => p._id === value);
      if (product) {
        newItems[index].price = product.salePrice;
        newItems[index].productName = product.name;
      }
    }

    setFormData({ ...formData, items: newItems });
  };

  const calculateTotal = () => {
    const subtotal = formData.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const total = subtotal + formData.tax - formData.discount;
    return { subtotal, total };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { subtotal, total } = calculateTotal();
      const saleData = {
        ...formData,
        subtotal,
        total,
        items: formData.items.map((item) => ({
          ...item,
          total: item.quantity * item.price,
        })),
      };

      await salesAPI.create(saleData);
      setShowModal(false);
      fetchData();
      resetForm();
    } catch (error) {
      console.error('Error creating sale:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      customer: '',
      items: [{ product: '', quantity: 1, price: 0 }],
      tax: 0,
      discount: 0,
      paid: 0,
      paymentMethod: 'cash',
      notes: '',
    });
  };

  const { subtotal, total } = calculateTotal();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sales Management</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <FaPlus /> New Sale
        </motion.button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sales.map((sale) => (
              <motion.tr
                key={sale._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ backgroundColor: '#f9fafb' }}
              >
                <td className="px-6 py-4 whitespace-nowrap font-semibold">{sale.invoiceNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sale.customer?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(sale.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">Rs. {sale.total.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">Rs. {sale.paid.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">Rs. {sale.balance.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      sale.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {sale.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FaEye />
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      <FaEdit />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-4">Create New Sale</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Customer</label>
                <select
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-gray-700 font-semibold">Items</label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="btn-secondary text-sm"
                  >
                    Add Item
                  </button>
                </div>
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                    <select
                      value={item.product}
                      onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                      className="input-field"
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                      className="input-field"
                      placeholder="Quantity"
                      min="1"
                      required
                    />
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                      className="input-field"
                      placeholder="Price"
                      min="0"
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Tax</label>
                  <input
                    type="number"
                    value={formData.tax}
                    onChange={(e) => setFormData({ ...formData, tax: parseFloat(e.target.value) || 0 })}
                    className="input-field"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Discount</label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                    className="input-field"
                    min="0"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Subtotal:</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Tax:</span>
                  <span>Rs. {formData.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Discount:</span>
                  <span>Rs. {formData.discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Paid Amount</label>
                  <input
                    type="number"
                    value={formData.paid}
                    onChange={(e) => setFormData({ ...formData, paid: parseFloat(e.target.value) || 0 })}
                    className="input-field"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="input-field"
                  >
                    <option value="cash">Cash</option>
                    <option value="credit">Credit</option>
                    <option value="bank">Bank</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-field"
                  rows="3"
                ></textarea>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="btn-primary flex-1">
                  Create Sale
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Sales;
