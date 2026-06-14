# Mini-ERP 2.0 (Nexus ERP)

A lightweight ERP system built for managing day-to-day business operations like inventory, sales, purchasing, and basic manufacturing. The goal was to create something simple to use while still covering the essential workflows that small and medium businesses rely on.

The project includes inventory tracking, audit logs, manufacturing flows using BOMs, and PDF generation for invoices and purchase orders.

## Features

### Dashboard

* Quick overview of stock levels and low-stock products
* Track open sales orders, purchase orders, and manufacturing tasks
* Clean and responsive UI for daily operations

### Product & Inventory Management

* Create and manage products
* Track inventory in real time
* Configure low-stock alerts
* Support for Make-To-Stock (MTS) and Make-To-Order (MTO) strategies

### Sales Orders & Purchase Orders

* Create, edit, and manage orders
* Dynamic line items with automatic total calculations
* Order lifecycle tracking from draft to completion

### Manufacturing (MRP)

* Create and manage Bills of Materials (BOM)
* Track Manufacturing Orders through different stages:

  * Draft
  * Confirmed
  * In Progress
  * Done

### Audit Trail

* Logs important changes across the system
* Stores previous and updated values for better traceability

### PDF Export

* Generate purchase orders and sales invoices as PDFs directly from the browser

---

## Tech Stack

### Frontend

* React 18
* Vite
* TypeScript
* TailwindCSS
* Zustand
* Framer Motion

### Backend

* Node.js
* Express.js

### Database

* MongoDB with Mongoose

### Authentication

* JWT-based authentication
* Protected routes

### Other Libraries

* Axios
* Lucide React
* jsPDF
* jsPDF-AutoTable

---

## Project Structure

```bash
final-work/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── app.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── modules/
│   │   └── types/
│   ├── package.json
│   └── vite.config.ts
```

The backend handles business logic, inventory calculations, and API endpoints, while the frontend is built as a modular React application to keep features isolated and easier to maintain.

---

## Installation

### Prerequisites

Before running the project, make sure you have:

* Node.js (v18+ recommended)
* npm or yarn
* MongoDB running locally or a MongoDB Atlas URI

---

### Clone the Repository

```bash
git clone <repository-url>
cd final-work
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

Start the backend server:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

The frontend usually starts on:

```bash
http://localhost:5173
```

---

## Database Seeding (Optional)

If you want some sample data to explore the system quickly:

```bash
cd backend
node seed.js
```

This will populate products, orders, and other demo records.

---

## What This Project Covers

* Inventory Management
* Sales Management
* Purchase Management
* Manufacturing Workflow
* Audit Logging
* PDF Generation
* Authentication & Authorization

---

## Challenges Faced

A few areas required extra attention during development:

* Keeping inventory values consistent across sales, purchases, and manufacturing.
* Maintaining audit logs without impacting performance.
* Managing dynamic order rows while preserving existing data during edits.
* Generating printable PDFs that look clean across different browsers.

---

## Future Improvements

* Role-based access control (RBAC)
* Email notifications for low stock and order updates
* Advanced analytics dashboard
* Multi-warehouse support
* Barcode and QR code integration

---

## Contributing

Contributions are always welcome. Feel free to open an issue or submit a pull request if you'd like to improve the project.

---

## License

This project is licensed under the MIT License.
