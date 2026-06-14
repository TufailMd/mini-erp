import PurchaseOrder from "../models/purchaseOrder.model.js";
import Product from "../models/product.model.js";
import Vendor from "../models/vendor.model.js";
import { getNextSequence, formatReference } from "../models/counter.model.js";
import { recordStockMovement } from "../utils/stockHelper.js";
import { writeAuditLog, writeFieldChangeLogs } from "../utils/auditLogHelper.js";

const TRACKED_FIELDS = [
  "vendor_id",
  "vendor_name",
  "vendor_address",
  "responsible_person",
  "status",
  "products",
];

export const createPurchaseOrder = async (req, res) => {
  try {
    const { vendor_id, responsible_person, products } = req.body;

    if (!products || products.length === 0) {
      throw new Error("At least one product is required");
    }

    const vendor = await Vendor.findById(vendor_id);
    if (!vendor) throw new Error("Vendor not found");

    const lineItems = [];
    for (const item of products) {
      const product = await Product.findById(item.product_id);
      if (!product) throw new Error(`Product not found: ${item.product_id}`);

      lineItems.push({
        product_id: product._id,
        product_name: product.name,
        ordered_quantity: item.ordered_quantity,
        received_quantity: 0,
        units: item.units || "Units",
        cost_price: item.cost_price !== undefined ? item.cost_price : product.cost_price,
      });
    }

    const seq = await getNextSequence("purchase_order");
    const po_number = formatReference("PO", seq);

    const purchaseOrder = await PurchaseOrder.create({
      po_number,
      vendor_id: vendor._id,
      vendor_name: vendor.name,
      vendor_address: vendor.vendor_address,
      responsible_person,
      status: "Draft",
      products: lineItems,
      auto_generated: req.body.auto_generated || false,
      source_reference: req.body.source_reference || null,
    });

    await writeAuditLog({
      module: "Purchase",
      record_id: purchaseOrder._id,
      record_reference: po_number,
      action: "Created",
      user: req.user?._id || null,
    });

    res.status(201).json({ success: true, data: purchaseOrder });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getPurchaseOrders = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { po_number: { $regex: search, $options: "i" } },
        { vendor_name: { $regex: search, $options: "i" } },
      ];
    }

    const orders = await PurchaseOrder.find(filter)
      .populate("responsible_person", "name email")
      .populate("vendor_id", "name")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await PurchaseOrder.countDocuments(filter);

    res.json({ success: true, data: orders, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPurchaseOrderById = async (req, res) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id)
      .populate("responsible_person", "name email")
      .populate("vendor_id", "name vendor_address responsible_person email phone");

    if (!order) {
      return res.status(404).json({ success: false, message: "Purchase Order not found" });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updatePurchaseOrder = async (req, res) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id);
    if (!order) throw new Error("Purchase Order not found");

    if (order.status !== "Draft") {
      throw new Error("Only Draft orders can be edited");
    }

    const before = order.toObject();
    const { vendor_id, responsible_person, products } = req.body;

    if (vendor_id !== undefined) {
      const vendor = await Vendor.findById(vendor_id);
      if (!vendor) throw new Error("Vendor not found");
      order.vendor_id = vendor._id;
      order.vendor_name = vendor.name;
      order.vendor_address = vendor.vendor_address;
    }

    if (responsible_person !== undefined) {
      order.responsible_person = responsible_person;
    }

    if (products !== undefined) {
      const lineItems = [];
      for (const item of products) {
        const product = await Product.findById(item.product_id);
        if (!product) throw new Error(`Product not found: ${item.product_id}`);

        lineItems.push({
          product_id: product._id,
          product_name: product.name,
          ordered_quantity: item.ordered_quantity,
          received_quantity: item.received_quantity || 0,
          units: item.units || "Units",
          cost_price: item.cost_price !== undefined ? item.cost_price : product.cost_price,
        });
      }
      order.products = lineItems;
    }

    await order.save();

    await writeFieldChangeLogs({
      module: "Purchase",
      record_id: order._id,
      record_reference: order.po_number,
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

export const confirmPurchaseOrder = async (req, res) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id);
    if (!order) throw new Error("Purchase Order not found");

    if (order.status !== "Draft") {
      throw new Error("Only Draft orders can be confirmed");
    }

    const before = order.toObject();

    order.status = "Confirmed";
    await order.save();

    await writeFieldChangeLogs({
      module: "Purchase",
      record_id: order._id,
      record_reference: order.po_number,
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

export const receivePurchaseOrder = async (req, res) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id);
    if (!order) throw new Error("Purchase Order not found");

    if (!["Confirmed", "Partially Received"].includes(order.status)) {
      throw new Error("Only Confirmed or Partially Received orders can be received");
    }

    const before = order.toObject();
    const { products: receiptUpdates } = req.body;

    if (!receiptUpdates || receiptUpdates.length === 0) {
      throw new Error("Received quantities are required");
    }

    for (const update of receiptUpdates) {
      const line = order.products.find(
        (p) => p.product_id.toString() === update.product_id.toString()
      );
      if (!line) throw new Error(`Product not found in order: ${update.product_id}`);

      const newReceived = Number(update.received_quantity);

      if (newReceived < line.received_quantity) {
        throw new Error(`Received quantity cannot decrease for ${line.product_name}`);
      }
      if (newReceived > line.ordered_quantity) {
        throw new Error(`Received quantity cannot exceed ordered quantity for ${line.product_name}`);
      }

      const delta = newReceived - line.received_quantity;

      if (delta > 0) {
        await recordStockMovement({
          product_id: line.product_id,
          transaction_type: "purchase_receipt",
          quantity: delta,
          reference_type: "PurchaseOrder",
          reference_id: order._id,
          notes: `Received ${delta} of ${line.product_name} for ${order.po_number}`,
          created_by: req.user?._id || null,
        });
      }

      line.received_quantity = newReceived;
    }

    const allFullyReceived = order.products.every(
      (line) => line.received_quantity === line.ordered_quantity
    );

    order.status = allFullyReceived ? "Fully Received" : "Partially Received";
    await order.save();

    await writeFieldChangeLogs({
      module: "Purchase",
      record_id: order._id,
      record_reference: order.po_number,
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

export const cancelPurchaseOrder = async (req, res) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id);
    if (!order) throw new Error("Purchase Order not found");

    if (["Fully Received", "Cancelled"].includes(order.status)) {
      throw new Error(`Cannot cancel an order that is ${order.status}`);
    }

    const before = order.toObject();

    order.status = "Cancelled";
    await order.save();

    await writeFieldChangeLogs({
      module: "Purchase",
      record_id: order._id,
      record_reference: order.po_number,
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

export const deletePurchaseOrder = async (req, res) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Purchase Order not found" });
    }

    if (order.status !== "Draft") {
      return res.status(400).json({ success: false, message: "Only Draft orders can be deleted" });
    }

    await PurchaseOrder.findByIdAndDelete(req.params.id);

    await writeAuditLog({
      module: "Purchase",
      record_id: order._id,
      record_reference: order.po_number,
      action: "Deleted",
      user: req.user?._id || null,
    });

    res.json({ success: true, message: "Purchase Order deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
