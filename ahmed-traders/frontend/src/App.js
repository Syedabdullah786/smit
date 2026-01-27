import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Sales from './pages/Sales';
import Inventory from './pages/Inventory';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} />
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

const PlaceholderPage = ({ title }) => (
  <div className="p-6">
    <div className="card text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
      <p className="text-gray-600">This page is under development</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <PrivateRoute>
                <Layout>
                  <Sales />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/purchase"
            element={
              <PrivateRoute>
                <Layout>
                  <PlaceholderPage title="Purchase Management" />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <PrivateRoute>
                <Layout>
                  <PlaceholderPage title="Expenses Management" />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <PrivateRoute>
                <Layout>
                  <Inventory />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <PrivateRoute>
                <Layout>
                  <PlaceholderPage title="Customers Management" />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/vendors"
            element={
              <PrivateRoute>
                <Layout>
                  <PlaceholderPage title="Vendors Management" />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/customer-balance"
            element={
              <PrivateRoute>
                <Layout>
                  <PlaceholderPage title="Customer Balance" />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/vendor-balance"
            element={
              <PrivateRoute>
                <Layout>
                  <PlaceholderPage title="Vendor Balance" />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/invoices"
            element={
              <PrivateRoute>
                <Layout>
                  <PlaceholderPage title="All Invoices" />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/recovery"
            element={
              <PrivateRoute>
                <Layout>
                  <PlaceholderPage title="Today Recovery" />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <PrivateRoute>
                <Layout>
                  <PlaceholderPage title="Employees Management" />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Layout>
                  <PlaceholderPage title="Admin Panel" />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
