# 📦 AHMED TRADERS - Complete Installation Guide for Visual Studio Code

This guide will walk you through setting up the Ahmed Traders Inventory Management System on your computer using Visual Studio Code.

## 📋 Table of Contents
1. [Prerequisites Installation](#prerequisites-installation)
2. [Project Setup in VS Code](#project-setup-in-vs-code)
3. [Backend Configuration](#backend-configuration)
4. [Frontend Configuration](#frontend-configuration)
5. [Running the Application](#running-the-application)
6. [Creating First Admin User](#creating-first-admin-user)
7. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites Installation

### Step 1.1: Install Node.js

1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS (Long Term Support)** version
3. Run the installer
4. Follow the installation wizard (keep default settings)
5. Verify installation:
   - Open Command Prompt (Windows) or Terminal (Mac/Linux)
   - Type: `node --version`
   - Type: `npm --version`
   - Both should show version numbers

### Step 1.2: Install MongoDB

**For Windows:**
1. Go to [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Download MongoDB Community Server
3. Run the installer
4. Choose "Complete" installation
5. Install MongoDB as a Service (check the box)
6. Install MongoDB Compass (optional GUI tool)

**For macOS:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**For Linux (Ubuntu/Debian):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Step 1.3: Install Visual Studio Code

1. Go to [https://code.visualstudio.com/](https://code.visualstudio.com/)
2. Download for your operating system
3. Install VS Code
4. Open VS Code

### Step 1.4: Install VS Code Extensions (Recommended)

Open VS Code and install these extensions:
1. Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (Mac)
2. Search and install:
   - **ES7+ React/Redux/React-Native snippets**
   - **Prettier - Code formatter**
   - **ESLint**
   - **MongoDB for VS Code**
   - **Thunder Client** (for API testing)

---

## 2. Project Setup in VS Code

### Step 2.1: Copy Project to Your Computer

1. Copy the entire `ahmed-traders` folder to your desired location
   - Example: `C:\Users\YourName\Projects\ahmed-traders` (Windows)
   - Example: `/Users/YourName/Projects/ahmed-traders` (Mac)
   - Example: `/home/yourname/Projects/ahmed-traders` (Linux)

### Step 2.2: Open Project in VS Code

1. Open Visual Studio Code
2. Click `File` → `Open Folder`
3. Navigate to the `ahmed-traders` folder
4. Click `Select Folder`

You should now see the project structure in the left sidebar:
```
ahmed-traders/
├── backend/
├── frontend/
└── README.md
```

---

## 3. Backend Configuration

### Step 3.1: Open Integrated Terminal

1. In VS Code, press `` Ctrl+` `` (backtick) or go to `View` → `Terminal`
2. You should see a terminal at the bottom of VS Code

### Step 3.2: Navigate to Backend Folder

```bash
cd backend
```

### Step 3.3: Install Backend Dependencies

```bash
npm install
```

This will take a few minutes. You'll see a progress bar installing packages.

### Step 3.4: Create Environment File

1. In the VS Code file explorer, navigate to `backend` folder
2. You'll see a file named `.env.example`
3. Right-click on `.env.example` → `Copy`
4. Right-click in the `backend` folder → `Paste`
5. Rename the copied file to `.env` (remove `.example`)

### Step 3.5: Configure Environment Variables

1. Open the `.env` file in VS Code
2. Edit the values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ahmed_traders
JWT_SECRET=ahmed_traders_secret_key_2026_change_in_production
NODE_ENV=development
```

**Important Notes:**
- `PORT=5000` - Backend will run on port 5000
- `MONGODB_URI` - Connection to local MongoDB database
- `JWT_SECRET` - Change this to a random string for security
- Save the file (`Ctrl+S` or `Cmd+S`)

---

## 4. Frontend Configuration

### Step 4.1: Open New Terminal

1. In VS Code, click the `+` icon in the terminal panel to open a new terminal
2. Or press `` Ctrl+Shift+` ``

### Step 4.2: Navigate to Frontend Folder

```bash
cd frontend
```

### Step 4.3: Install Frontend Dependencies

```bash
npm install
```

This will take several minutes as it installs React and all dependencies.

---

## 5. Running the Application

### Step 5.1: Start MongoDB

**Windows:**
- MongoDB should already be running as a service
- To verify, open Command Prompt and type: `mongod --version`

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### Step 5.2: Start Backend Server

1. In VS Code terminal, make sure you're in the `backend` folder
2. Run:
```bash
npm start
```

You should see:
```
Server running on port 5000
MongoDB Connected: localhost
```

**Keep this terminal running!**

### Step 5.3: Start Frontend Server

1. Open a **new terminal** in VS Code (click `+` icon)
2. Navigate to frontend:
```bash
cd frontend
```
3. Run:
```bash
npm start
```

You should see:
```
Compiled successfully!
You can now view frontend in the browser.
  Local:            http://localhost:3000
```

Your browser should automatically open to `http://localhost:3000`

**Keep this terminal running too!**

---

## 6. Creating First Admin User

### Method 1: Using Thunder Client (VS Code Extension)

1. Install Thunder Client extension in VS Code
2. Click the Thunder Client icon in the left sidebar
3. Click `New Request`
4. Set method to `POST`
5. Enter URL: `http://localhost:5000/api/auth/register`
6. Click `Body` tab
7. Select `JSON`
8. Paste this:
```json
{
  "name": "Admin User",
  "email": "admin@ahmed.com",
  "password": "admin123",
  "role": "admin"
}
```
9. Click `Send`

### Method 2: Using Command Line

Open a new terminal and run:

**Windows (PowerShell):**
```powershell
Invoke-WebRequest -Uri http://localhost:5000/api/auth/register -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"name":"Admin User","email":"admin@ahmed.com","password":"admin123","role":"admin"}'
```

**macOS/Linux:**
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

### Method 3: Using Postman

1. Download Postman from [https://www.postman.com/downloads/](https://www.postman.com/downloads/)
2. Create a new POST request
3. URL: `http://localhost:5000/api/auth/register`
4. Body → raw → JSON
5. Paste the JSON from Method 1
6. Click Send

---

## 7. Login and Use the Application

1. Open browser to `http://localhost:3000`
2. You should see the login page
3. Enter credentials:
   - **Email**: `admin@ahmed.com`
   - **Password**: `admin123`
4. Click Login
5. You'll be redirected to the Dashboard!

---

## 8. Troubleshooting

### Problem: "MongoDB connection failed"

**Solution:**
1. Check if MongoDB is running:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status mongod
   ```

2. Verify connection string in `.env` file
3. Try restarting MongoDB service

### Problem: "Port 5000 already in use"

**Solution:**
1. Change port in `backend/.env`:
   ```env
   PORT=5001
   ```
2. Update API URL in `frontend/src/utils/api.js`:
   ```javascript
   const API_URL = 'http://localhost:5001/api';
   ```

### Problem: "npm install" fails

**Solution:**
1. Delete `node_modules` folder and `package-lock.json`
2. Run `npm cache clean --force`
3. Run `npm install` again

### Problem: Frontend won't start

**Solution:**
1. Make sure you're in the `frontend` folder
2. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Problem: "Cannot find module" errors

**Solution:**
1. Make sure all dependencies are installed
2. In both `backend` and `frontend` folders, run:
   ```bash
   npm install
   ```

---

## 9. Development Workflow in VS Code

### Recommended VS Code Layout

1. **Left Sidebar**: File Explorer
2. **Main Area**: Code Editor
3. **Bottom Panel**: 
   - Terminal 1: Backend server
   - Terminal 2: Frontend server
   - Terminal 3: For running commands

### Useful VS Code Shortcuts

- `Ctrl+P` - Quick file open
- `Ctrl+Shift+F` - Search in all files
- `Ctrl+B` - Toggle sidebar
- `` Ctrl+` `` - Toggle terminal
- `Ctrl+/` - Comment/uncomment line
- `Alt+Up/Down` - Move line up/down
- `Ctrl+D` - Select next occurrence

### Stopping the Servers

To stop the servers:
1. Click on the terminal running the server
2. Press `Ctrl+C`
3. Type `Y` if prompted

---

## 10. Next Steps

Now that your application is running:

1. **Explore the Dashboard** - View business metrics and charts
2. **Add Products** - Go to Inventory → Add Product
3. **Add Customers** - Go to Customers → Add Customer
4. **Create a Sale** - Go to Sales → New Sale
5. **View Reports** - Check various reports and analytics

---

## 📞 Need Help?

If you encounter any issues:

1. Check the terminal for error messages
2. Review this guide step by step
3. Check the main README.md for additional information
4. Ensure all prerequisites are properly installed

---

**Congratulations! 🎉 You've successfully set up Ahmed Traders Inventory Management System!**
