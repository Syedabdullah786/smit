# AHMED TRADERS - Inventory Management System

A comprehensive, full-stack inventory management system built with React, Node.js, Express, and MongoDB. Features beautiful animations, real-time dashboards, and complete business management capabilities.

## 🚀 Features

### Core Modules
- **Dashboard** - Real-time analytics with graphs and statistics
- **Sales Management** - Create invoices, track sales, manage customer orders
- **Purchase Management** - Vendor purchases, stock updates
- **Expense Tracking** - Record and categorize business expenses
- **Inventory Management** - Product catalog, stock levels, low-stock alerts
- **Customer Management** - Customer database with balance tracking
- **Vendor Management** - Vendor database with payables
- **Invoice System** - Generate professional invoices
- **Delivery Challan** - Create delivery notes
- **Quotations** - Generate price quotes for customers
- **Employee Management** - Staff records and payroll
- **Recovery Tracking** - Daily payment collection monitoring

### Technical Features
- ✅ JWT Authentication & Authorization
- ✅ Role-based Access Control (Admin/User)
- ✅ Beautiful UI with Tailwind CSS
- ✅ Smooth Animations with Framer Motion
- ✅ Interactive Charts with Recharts
- ✅ RESTful API Architecture
- ✅ MongoDB Database
- ✅ Responsive Design
- ✅ Real-time Dashboard Updates

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager

## 🛠️ Installation & Setup

### Step 1: Install MongoDB

1. Download and install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```bash
   # On Windows
   net start MongoDB
   
   # On macOS/Linux
   sudo systemctl start mongod
   ```

### Step 2: Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd ahmed-traders/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` file with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ahmed_traders
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   NODE_ENV=development
   ```

5. Start the backend server:
   ```bash
   npm start
   ```

   The backend API will run on `http://localhost:5000`

### Step 3: Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd ahmed-traders/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`

### Step 4: Create Admin User

1. Use a tool like Postman or curl to create the first admin user:
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
   -H "Content-Type: application/json" \
   -d '{
     "name": "Admin User",
     "email": "admin@ahmed.com",
     "password": "admin123",
     "role": "admin"
   }'
   ```

## 🎯 Usage

### Login Credentials
- **Email**: admin@ahmed.com
- **Password**: admin123

### Accessing the Application

1. Open your browser and go to `http://localhost:3000`
2. Login with the admin credentials
3. You'll be redirected to the dashboard

### Main Features Access

- **Dashboard**: Overview of business metrics, charts, and statistics
- **Sales**: Create new sales invoices, view sales history
- **Inventory**: Add/edit products, track stock levels
- **Customers**: Manage customer database and balances
- **Vendors**: Manage vendor information and payables
- **Reports**: View various business reports and analytics

## 📁 Project Structure

```
ahmed-traders/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── models/
│   │   ├── User.js               # User model
│   │   ├── Customer.js           # Customer model
│   │   ├── Vendor.js             # Vendor model
│   │   ├── Product.js            # Product model
│   │   ├── Sale.js               # Sale model
│   │   ├── Purchase.js           # Purchase model
│   │   ├── Expense.js            # Expense model
│   │   ├── Quotation.js          # Quotation model
│   │   ├── DeliveryChallan.js    # Delivery challan model
│   │   └── Payment.js            # Payment model
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── products.js           # Product routes
│   │   ├── customers.js          # Customer routes
│   │   ├── vendors.js            # Vendor routes
│   │   ├── sales.js              # Sales routes
│   │   ├── purchases.js          # Purchase routes
│   │   ├── expenses.js           # Expense routes
│   │   └── dashboard.js          # Dashboard routes
│   ├── middleware/
│   │   └── auth.js               # Authentication middleware
│   ├── server.js                 # Express server
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.js        # Sidebar navigation
    │   │   └── Navbar.js         # Top navigation bar
    │   ├── pages/
    │   │   ├── Login.js          # Login page
    │   │   ├── Dashboard.js      # Dashboard page
    │   │   ├── Sales.js          # Sales management
    │   │   └── Inventory.js      # Inventory management
    │   ├── context/
    │   │   └── AuthContext.js    # Authentication context
    │   ├── utils/
    │   │   └── api.js            # API utility functions
    │   ├── App.js                # Main app component
    │   └── index.css             # Global styles
    └── package.json
```

## 🎨 How to Copy to Visual Studio Code

### Method 1: Clone/Copy the Entire Project

1. Open Visual Studio Code
2. Click `File` → `Open Folder`
3. Navigate to the `ahmed-traders` folder location
4. Click `Select Folder`

### Method 2: Create New Project

1. Open Visual Studio Code
2. Open Terminal (`Ctrl + ~` or `View` → `Terminal`)
3. Navigate to where you want to create the project:
   ```bash
   cd /path/to/your/projects
   ```
4. Copy the entire `ahmed-traders` folder to this location
5. In VS Code, click `File` → `Open Folder` → Select `ahmed-traders`

### Method 3: Using Git (Recommended)

If you have the project in a Git repository:

1. Open VS Code
2. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
3. Type "Git: Clone" and press Enter
4. Enter the repository URL
5. Select the destination folder

## 🔧 Development

### Running in Development Mode

**Backend:**
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

**Frontend:**
```bash
cd frontend
npm start
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

This creates an optimized production build in the `build` folder.

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Sales
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Create sale
- `GET /api/sales/today` - Get today's sales

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/charts` - Get chart data

## 🎨 Customization

### Changing Colors

Edit `frontend/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Change these values
        500: '#0ea5e9',
        600: '#0284c7',
        // ...
      }
    }
  }
}
```

### Adding New Features

1. **Backend**: Create model in `backend/models/`, add routes in `backend/routes/`
2. **Frontend**: Create page in `frontend/src/pages/`, add route in `App.js`

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `sudo systemctl status mongod`
- Check connection string in `.env` file

### Port Already in Use
- Change port in backend `.env` file
- Update API URL in frontend `src/utils/api.js`

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Support

For issues and questions:
- Create an issue in the repository
- Contact: support@ahmedtraders.com

## 🎉 Credits

Developed with ❤️ for Ahmed Traders Business Management

---

**Happy Coding! 🚀**
