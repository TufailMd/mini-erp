import Product from "../models/product.model.js";

export const getInventoryDashboard = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const stockSummary = await Product.aggregate([
      {
        $project: {
          name: 1,
          sku: 1,
          on_hand_qty: 1,
          reserved_qty: 1,
          free_qty: { $subtract: ["$on_hand_qty", "$reserved_qty"] },
          low_stock_threshold: 1,
          is_low_stock: {
            $lt: [
              { $subtract: ["$on_hand_qty", "$reserved_qty"] },
              "$low_stock_threshold",
            ],
          },
        },
      },
    ]);

    const totalOnHand = stockSummary.reduce((sum, p) => sum + p.on_hand_qty, 0);
    const totalReserved = stockSummary.reduce((sum, p) => sum + p.reserved_qty, 0);
    const lowStockCount = stockSummary.filter((p) => p.is_low_stock).length;

    res.json({
      success: true,
      data: {
        total_products: totalProducts,
        total_on_hand_qty: totalOnHand,
        total_reserved_qty: totalReserved,
        total_free_qty: totalOnHand - totalReserved,
        low_stock_count: lowStockCount,
        products: stockSummary,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getLowStockAlerts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $project: {
          name: 1,
          sku: 1,
          on_hand_qty: 1,
          reserved_qty: 1,
          low_stock_threshold: 1,
          free_qty: { $subtract: ["$on_hand_qty", "$reserved_qty"] },
        },
      },
      {
        $match: {
          $expr: { $lt: ["$free_qty", "$low_stock_threshold"] },
        },
      },
    ]);

    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};