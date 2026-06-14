import SalesOrder from "../models/salesOrder.model.js";
import PurchaseOrder from "../models/purchaseOrder.model.js";
import ManufacturingOrder from "../models/manufacturingOrder.model.js";
import Product from "../models/product.model.js";

export const getDashboardMetrics = async (req, res) => {
  try {
    const [salesOrders, purchaseOrders, manufacturingOrders, products] = await Promise.all([
      SalesOrder.find(),
      PurchaseOrder.find(),
      ManufacturingOrder.find(),
      Product.find()
    ]);

    // Compute basic metrics
    const salesMetrics = {
      total: salesOrders.length,
      confirmed: salesOrders.filter(so => so.status === "Confirmed").length,
      pending: salesOrders.filter(so => so.status !== "Fully Delivered" && so.status !== "Cancelled").length,
      completed: salesOrders.filter(so => so.status === "Fully Delivered").length,
    };

    const purchaseMetrics = {
      total: purchaseOrders.length,
      confirmed: purchaseOrders.filter(po => po.status === "Confirmed").length,
      partial: purchaseOrders.filter(po => po.status === "Partially Received").length,
      completed: purchaseOrders.filter(po => po.status === "Completed" || po.status === "Fully Received").length,
    };

    const manufacturingMetrics = {
      total: manufacturingOrders.length,
      confirmed: manufacturingOrders.filter(mo => mo.status === "Confirmed").length,
      inProgress: manufacturingOrders.filter(mo => mo.status === "In Progress" || mo.status === "Partially Processed").length,
      completed: manufacturingOrders.filter(mo => mo.status === "Completed" || mo.status === "Done").length,
    };

    const inventoryMetrics = {
      totalProducts: products.length,
      lowStock: products.filter(p => p.on_hand_qty <= (p.low_stock_threshold || 0)).length,
      totalStock: products.reduce((acc, p) => acc + (p.on_hand_qty || 0), 0)
    };

    res.status(200).json({
      success: true,
      data: {
        salesMetrics,
        purchaseMetrics,
        manufacturingMetrics,
        inventoryMetrics
      }
    });
  } catch (error) {
    console.error("Dashboard Metrics Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error fetching dashboard metrics"
    });
  }
};
