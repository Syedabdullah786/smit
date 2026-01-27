# 🚀 AHMED TRADERS - Quick Start Guide

## ⚡ Fast Setup (5 Minutes)

### Prerequisites Check
✅ Node.js installed? Run: `node --version`  
✅ MongoDB installed? Run: `mongod --version`  
✅ VS Code installed?

If any are missing, see [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)

---

## 🎯 3-Step Setup

### Step 1: Open in VS Code
```bash
# Open VS Code in project folder
code ahmed-traders
```

### Step 2: Install & Run Backend
```bash
# Terminal 1
cd backend
npm install
npm start
```

Wait for: `✓ MongoDB Connected: localhost`

### Step 3: Install & Run Frontend
```bash
# Terminal 2 (new terminal)
cd frontend
npm install
npm start
```

Browser opens automatically at `http://localhost:3000`

---

## 👤 Create Admin User

**Option A: Using curl (Mac/Linux)**
```bash
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"name":"Admin","email":"admin@ahmed.com","password":"admin123","role":"admin"}'
```

**Option B: Using PowerShell (Windows)**
```powershell
Invoke-RestMethod -Uri http://localhost:5000/api/auth/register -Method POST -ContentType "application/json" -Body '{"name":"Admin","email":"admin@ahmed.com","password":"admin123","role":"admin"}'
```

---

## 🔐 Login

Go to `http://localhost:3000`

- **Email**: admin@ahmed.com
- **Password**: admin123

---

## 📁 Project Structure

```
ahmed-traders/
├── backend/          # Node.js + Express API
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API endpoints
│   ├── config/       # Database config
│   └── server.js     # Main server file
│
└── frontend/         # React application
    ├── src/
    │   ├── pages/    # Dashboard, Sales, etc.
    │   ├── components/ # Sidebar, Navbar
    │   └── context/  # Auth context
    └── public/
```

---

## 🛠️ Common Commands

### Backend
```bash
cd backend
npm start          # Start server
npm run dev        # Start with nodemon (auto-reload)
```

### Frontend
```bash
cd frontend
npm start          # Start dev server
npm run build      # Build for production
```

---

## 🎨 Features Overview

| Module | Description |
|--------|-------------|
| 📊 Dashboard | Real-time stats, charts, analytics |
| 🛒 Sales | Create invoices, track sales |
| 📦 Inventory | Manage products, stock levels |
| 👥 Customers | Customer database, balances |
| 🚚 Vendors | Vendor management, payables |
| 💰 Expenses | Track business expenses |
| 📄 Invoices | Generate professional invoices |
| 👨‍💼 Employees | Staff management, payroll |

---

## 🔧 Quick Fixes

### MongoDB not running?
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Port already in use?
Change port in `backend/.env`:
```env
PORT=5001
```

### Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📱 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/api

---

## 🎓 Next Steps

1. ✅ Login to dashboard
2. ✅ Add some products (Inventory → Add Product)
3. ✅ Add customers (Customers → Add Customer)
4. ✅ Create your first sale (Sales → New Sale)
5. ✅ View analytics on Dashboard

---

## 📚 Documentation

- [Full Installation Guide](INSTALLATION_GUIDE.md)
- [README](README.md)
- [API Documentation](#) (Coming soon)

---

## 💡 Tips

- Keep both terminals running (backend + frontend)
- Use `Ctrl+C` to stop servers
- Check terminal for errors
- MongoDB must be running before starting backend

---

**Happy Trading! 🎉**
