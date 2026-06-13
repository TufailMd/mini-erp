import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import productRoutes from "./routes/product.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import stockLedgerRoutes from "./routes/stockLedger.routes.js";
import categoryRoutes from "./routes/category.routes.js";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import auditRoutes from "./routes/audit.route.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/stockLedger", stockLedgerRoutes);
app.use("/api/categories", categoryRoutes);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/audit-logs", auditRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});