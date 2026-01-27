import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { productsAPI } from '../utils/api';
import { FaPlus, FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    partNumber: '',
    category: '',
    description: '',
    unit: 'pcs',
    purchasePrice: 0,
    salePrice: 0,
    stock: 0,
    minStock: 10,
    location: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct._id, formData);
      } else {
        await productsAPI.create(formData);
      }
      setShowModal(false);
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(id);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      partNumber: '',
      category: '',
      description: '',
      unit: 'pcs',
      purchasePrice: 0,
      salePrice: 0,
      stock: 0,
      minStock: 10,
      location: '',
    });
    setEditingProduct(null);
  };

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
        <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <FaPlus /> Add Product
        </motion.button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Part #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purchase Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sale Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <motion.tr
                key={product._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ backgroundColor: '#f9fafb' }}
                className={product.stock <= product.minStock ? 'bg-red-50' : ''}
              >
                <td className="px-6 py-4 whitespace-nowrap font-semibold">{product.partNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {product.name}
                    {product.stock <= product.minStock && (
                      <FaExclamationTriangle className="text-red-500" title="Low Stock" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`font-semibold ${
                      product.stock <= product.minStock ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {product.stock} {product.unit}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{product.minStock}</td>
                <td className="px-6 py-4 whitespace-nowrap">Rs. {product.purchasePrice.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">Rs. {product.salePrice.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.location}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-800"
                    >
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
            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Part Number</label>
                  <input
                    type="text"
                    value={formData.partNumber}
                    onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="input-field"
                  >
                    <option value="pcs">Pieces</option>
                    <option value="kg">Kilogram</option>
                    <option value="ltr">Liter</option>
                    <option value="box">Box</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows="2"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Purchase Price</label>
                  <input
                    type="number"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })}
                    className="input-field"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Sale Price</label>
                  <input
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: parseFloat(e.target.value) || 0 })}
                    className="input-field"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseFloat(e.target.value) || 0 })}
                    className="input-field"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Min Stock</label>
                  <input
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: parseFloat(e.target.value) || 0 })}
                    className="input-field"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingProduct ? 'Update Product' : 'Add Product'}
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

export default Inventory;
