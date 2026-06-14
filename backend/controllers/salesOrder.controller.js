import SalesOrder from "../models/salesOrder.model.js";
import Product from "../models/product.model.js";
import { getNextSequence, formatReference } from "../models/counter.model.js";
import {
  recordStockMovement,
  updateReservedQty,
  getFreeQty,
} from "../utils/stockHelper.js";
import { writeAuditLog, writeFieldChangeLogs } from "../utils/auditLogHelper.js";

const TRACKED_FIELDS = [
  "customer",
  "customer_address",
  "sales_person",
  "status",
  "products",
];

export const createSalesOrder = async (req, res) => {
  try {
    const { customer, customer_address, sales_person, products } = req.body;

    if (!products || products.length === 0) {
      throw new Error("At least one product is required");
    }

    const lineItems = [];
    for (const item of products) {
      const product = await Product.findById(item.product_id);
      if (!product) throw new Error(`Product not found: ${item.product_id}`);

      const freeQty = (product.on_hand_qty || 0) - (product.reserved_qty || 0);

      lineItems.push({
        product_id: product._id,
        product_name: product.name,
        availability: freeQty,
        ordered_quantity: item.ordered_quantity,
        delivered_quantity: 0,
        units: item.units || "Units",
        sales_unit_price:
          item.sales_unit_price !== undefined
            ? item.sales_unit_price
            : product.sales_price,
      });
    }

    const seq = await getNextSequence("sales_order");
    const so_number = formatReference("SO", seq);

    const salesOrder = await SalesOrder.create({
      so_number,
      customer,
      customer_address,
      sales_person,
      status: "Draft",
      products: lineItems,
    });

    await writeAuditLog({
      module: "Sales",
      record_id: salesOrder._id,
      record_reference: so_number,
      action: "Created",
      user: req.user?._id || null,
    });

    res.status(201).json({ success: true, data: salesOrder });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getSalesOrders = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { so_number: { $regex: search, $options: "i" } },
        { customer: { $regex: search, $options: "i" } },
      ];
    }

    const orders = await SalesOrder.find(filter)
      .populate("sales_person", "name email")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await SalesOrder.countDocuments(filter);

    res.json({ success: true, data: orders, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSalesOrderById = async (req, res) => {
  try {
    const order = await SalesOrder.findById(req.params.id).populate(
      "sales_person",
      "name email"
    );
    if (!order) {
      return res.status(404).json({ success: false, message: "Sales Order not found" });
    }

    const productsWithAvailability = await Promise.all(
      order.products.map(async (line) => {
        const freeQty = await getFreeQty(line.product_id);
        return { ...line.toObject(), availability: freeQty };
      })
    );

    res.json({
      success: true,
      data: { ...order.toObject(), products: productsWithAvailability },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateSalesOrder = async (req, res) => {
  try {
    const order = await SalesOrder.findById(req.params.id);
    if (!order) throw new Error("Sales Order not found");

    if (order.status !== "Draft") {
      throw new Error("Only Draft orders can be edited");
    }

    const before = order.toObject();
    const { customer, customer_address, sales_person, products } = req.body;

    if (customer !== undefined) order.customer = customer;
    if (customer_address !== undefined) order.customer_address = customer_address;
    if (sales_person !== undefined) order.sales_person = sales_person;

    if (products !== undefined) {
      const lineItems = [];
      for (const item of products) {
        const product = await Product.findById(item.product_id);
        if (!product) throw new Error(`Product not found: ${item.product_id}`);

        const freeQty = (product.on_hand_qty || 0) - (product.reserved_qty || 0);

        lineItems.push({
          product_id: product._id,
          product_name: product.name,
          availability: freeQty,
          ordered_quantity: item.ordered_quantity,
          delivered_quantity: item.delivered_quantity || 0,
          units: item.units || "Units",
          sales_unit_price:
            item.sales_unit_price !== undefined
              ? item.sales_unit_price
              : product.sales_price,
        });
      }
      order.products = lineItems;
    }

    await order.save();

    await writeFieldChangeLogs({
      module: "Sales",
      record_id: order._id,
      record_reference: order.so_number,
      before,
      after: order.toObject(),
      fieldsToTrack: TRACKED_FIELDS,
      user: req.user?._id || null,
    });

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const confirmSalesOrder = async (req, res) => {
  try {
    const order = await SalesOrder.findById(req.params.id);
    if (!order) throw new Error("Sales Order not found");

    if (order.status !== "Draft") {
      throw new Error("Only Draft orders can be confirmed");
    }

    const before = order.toObject();
    const shortages = [];

    for (const line of order.products) {
      const product = await Product.findById(line.product_id);
      if (!product) throw new Error(`Product not found: ${line.product_id}`);

      const freeQty = (product.on_hand_qty || 0) - (product.reserved_qty || 0);

      if (line.ordered_quantity > freeQty) {
        shortages.push({
          product_id: product._id,
          product_name: product.name,
          shortage: line.ordered_quantity - freeQty,
          procure_on_demand: product.procure_on_demand,
          procurement_type: product.procurement_type,
        });
      }

      await updateReservedQty(product._id, line.ordered_quantity);
    }

    order.status = "Confirmed";
    await order.save();

    await writeFieldChangeLogs({
      module: "Sales",
      record_id: order._id,
      record_reference: order.so_number,
      before,
      after: order.toObject(),
      fieldsToTrack: ["status"],
      user: req.user?._id || null,
    });

    res.json({ success: true, data: order, shortages });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deliverSalesOrder = async (req, res) => {
  try {
    const order = await SalesOrder.findById(req.params.id);
    if (!order) throw new Error("Sales Order not found");

    if (!["Confirmed", "Partially Delivered"].includes(order.status)) {
      throw new Error("Only Confirmed or Partially Delivered orders can be delivered");
    }

    const before = order.toObject();
    const { products: deliveryUpdates } = req.body;

    if (!deliveryUpdates || deliveryUpdates.length === 0) {
      throw new Error("Delivery quantities are required");
    }

    for (const update of deliveryUpdates) {
      const line = order.products.find(
        (p) => p.product_id.toString() === update.product_id.toString()
      );
      if (!line) throw new Error(`Product not found in order: ${update.product_id}`);

      const newDelivered = Number(update.delivered_quantity);

      if (newDelivered < line.delivered_quantity) {
        throw new Error(`Delivered quantity cannot decrease for ${line.product_name}`);
      }
      if (newDelivered > line.ordered_quantity) {
        throw new Error(`Delivered quantity cannot exceed ordered quantity for ${line.product_name}`);
      }

      const delta = newDelivered - line.delivered_quantity;

      if (delta > 0) {
        await recordStockMovement({
          product_id: line.product_id,
          transaction_type: "sales_delivery",
          quantity: -delta,
          reference_type: "SalesOrder",
          reference_id: order._id,
          notes: `Delivered ${delta} of ${line.product_name} for ${order.so_number}`,
          created_by: req.user?._id || null,
        });

        await updateReservedQty(line.product_id, -delta);
      }

      line.delivered_quantity = newDelivered;
    }

    const allFullyDelivered = order.products.every(
      (line) => line.delivered_quantity === line.ordered_quantity
    );

    order.status = allFullyDelivered ? "Fully Delivered" : "Partially Delivered";
    await order.save();

    await writeFieldChangeLogs({
      module: "Sales",
      record_id: order._id,
      record_reference: order.so_number,
      before,
      after: order.toObject(),
      fieldsToTrack: ["status", "products"],
      user: req.user?._id || null,
    });

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const cancelSalesOrder = async (req, res) => {
  try {
    const order = await SalesOrder.findById(req.params.id);
    if (!order) throw new Error("Sales Order not found");

    if (["Fully Delivered", "Cancelled"].includes(order.status)) {
      throw new Error(`Cannot cancel an order that is ${order.status}`);
    }

    const before = order.toObject();

    if (["Confirmed", "Partially Delivered"].includes(order.status)) {
      for (const line of order.products) {
        const remaining = line.ordered_quantity - line.delivered_quantity;
        if (remaining > 0) {
          await updateReservedQty(line.product_id, -remaining);
        }
      }
    }

    order.status = "Cancelled";
    await order.save();

    await writeFieldChangeLogs({
      module: "Sales",
      record_id: order._id,
      record_reference: order.so_number,
      before,
      after: order.toObject(),
      fieldsToTrack: ["status"],
      user: req.user?._id || null,
    });

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteSalesOrder = async (req, res) => {
  try {
    const order = await SalesOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Sales Order not found" });
    }

    if (order.status !== "Draft") {
      return res
        .status(400)
        .json({ success: false, message: "Only Draft orders can be deleted" });
    }

    await SalesOrder.findByIdAndDelete(req.params.id);

    await writeAuditLog({
      module: "Sales",
      record_id: order._id,
      record_reference: order.so_number,
      action: "Deleted",
      user: req.user?._id || null,
    });

    res.json({ success: true, message: "Sales Order deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
