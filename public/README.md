# Retail Sales Management System

## 1. Overview

A full-stack web app to manage retail sales data with search, filters, sorting, and pagination. Built with React frontend and Node.js backend using MongoDB. Handles large datasets (200MB+) efficiently.

## 2. Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose  
**Frontend:** React, Tailwind CSS, Vite, Axios

## 3. Search Implementation Summary

Search works on Customer Name and Phone Number. It's case-insensitive and runs on the server using MongoDB regex. Search works with filters and sorting. The search bar is in the header and updates results in real-time.

## 4. Filter Implementation Summary

Multi-select filters for Region, Gender, Category, Tags, and Payment Method. Age and Date use range inputs. Filters work alone or together. State is saved when you search or sort. Backend uses MongoDB `$in` for multi-select and range operators for age/date. Refresh button clears all filters.

## 5. Sorting Implementation Summary

Sort by Date (newest first - default), Quantity, or Customer Name (A-Z). Sorting runs on the server using MongoDB sort. Sort dropdown is in the filter panel. When you change sort, it goes to page 1 but keeps your search and filters.

## 6. Pagination Implementation Summary

Shows 10 items per page. Displays page numbers (up to 6 visible) with Previous/Next buttons. Active page is highlighted. Buttons disable at first/last page. Pagination state is saved with search, filters, and sorting. When filters/search change, it resets to page 1.

## 7. Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB running on port 27017
- npm

### Backend Setup

1. Go to backend folder:
   ```bash
   cd backend
   ```

2. Install packages:
   ```bash
   npm install
   ```

3. Import CSV data (do this once):
   ```bash
   node src/utils/importData.js
   ```

4. Start server:
   ```bash
   node src/index.js
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. Go to frontend folder:
   ```bash
   cd frontend
   ```

2. Install packages:
   ```bash
   npm install
   ```

3. Start dev server:
   ```bash
   npm run dev
   ```
   App opens at `http://localhost:5173`

### Check Everything Works

1. Make sure MongoDB is running (`mongod`)

2. Test backend: Visit `http://localhost:5000/api/sales` - should show JSON data

3. Test frontend: Visit `http://localhost:5173` - should show the UI

### Check Your Data

To see if data imported correctly:
```bash
cd backend
node src/utils/checkData.js
```
