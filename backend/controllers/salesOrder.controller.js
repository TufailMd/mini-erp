import mongoose from "mongoose";
import SalesOrder from "../models/salesOrder.model.js";
import Product from "../models/product.model.js";
import Counter, { getNextSequence, formatReference } from "../models/counter.model.js";
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

// ---------------------------------------------------------------------
// CREATE - new SO is always created in Draft status
// ---------------------------------------------------------------------
export const createSalesOrder = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { customer, customer_address, sales_person, products } = req.body;

    if (!products || products.length === 0) {
      throw new Error("At least one product is required");
    }

    // Validate + snapshot product details
    const lineItems = [];
    for (const item of products) {
      const product = await Product.findById(item.product_id).session(session);
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

    const seq = await getNextSequence("sales_order", session);
    const so_number = formatReference("SO", seq);

    const salesOrder = await SalesOrder.create(
      [
        {
          so_number,
          customer,
          customer_address,
          sales_person,
          status: "Draft",
          products: lineItems,
        },
      ],
      { session }
    );

    await writeAuditLog({
      module: "Sales",
      record_id: salesOrder[0]._id,
      record_reference: so_number,
      action: "Created",
      user: req.body.user_id || null,
      session,
    });

    await session.commitTransaction();
    res.status(201).json({ success: true, data: salesOrder[0] });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};

// ---------------------------------------------------------------------
// GET ALL - supports filter by status, search by reference/customer
// ---------------------------------------------------------------------
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

// ---------------------------------------------------------------------
// GET BY ID
// ---------------------------------------------------------------------
export const getSalesOrderById = async (req, res) => {
  try {
    const order = await SalesOrder.findById(req.params.id).populate(
      "sales_person",
      "name email"
    );
    if (!order) {
      return res.status(404).json({ success: false, message: "Sales Order not found" });
    }

    // Refresh availability snapshot for each line (live free_qty)
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

// ---------------------------------------------------------------------
// UPDATE (Draft only) - editing line items, customer info etc.
// ---------------------------------------------------------------------
export const updateSalesOrder = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const order = await SalesOrder.findById(req.params.id).session(session);
    if (!order) {
      throw new Error("Sales Order not found");
    }

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
        const product = await Product.findById(item.product_id).session(session);
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

    await order.save({ session });

    await writeFieldChangeLogs({
      module: "Sales",
      record_id: order._id,
      record_reference: order.so_number,
      before,
      after: order.toObject(),
      fieldsToTrack: TRACKED_FIELDS,
      user: req.body.user_id || null,
      session,
    });

    await session.commitTransaction();
    res.json({ success: true, data: order });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};

// ---------------------------------------------------------------------
// CONFIRM - Draft -> Confirmed
// - Check availability
// - Reserve quantity on each product
// - (Procurement automation hook - placeholder for future PO/MO creation)
// ---------------------------------------------------------------------
export const confirmSalesOrder = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const order = await SalesOrder.findById(req.params.id).session(session);
    if (!order) throw new Error("Sales Order not found");

    if (order.status !== "Draft") {
      throw new Error("Only Draft orders can be confirmed");
    }

    const before = order.toObject();
    const shortages = [];

    for (const line of order.products) {
      const product = await Product.findById(line.product_id).session(session);
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

      // Reserve the ordered quantity regardless of shortage
      await updateReservedQty(product._id, line.ordered_quantity, session);
    }

    order.status = "Confirmed";
    await order.save({ session });

    await writeFieldChangeLogs({
      module: "Sales",
      record_id: order._id,
      record_reference: order.so_number,
      before,
      after: order.toObject(),
      fieldsToTrack: ["status"],
      user: req.body.user_id || null,
      session,
    });

    // NOTE: Procurement automation (auto-creating PO/MO for shortages)
    // will be implemented once the Purchase/Manufacturing modules exist.
    // `shortages` array is returned so the frontend can display a warning
    // and/or trigger that flow.

    await session.commitTransaction();
    res.json({ success: true, data: order, shortages });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};

// ---------------------------------------------------------------------
// DELIVER - Confirmed/Partially Delivered -> Partially/Fully Delivered
// - Update delivered_quantity per line
// - Decrease on_hand_qty and reserved_qty by the delivered delta
// - If all lines fully delivered -> Fully Delivered (lock everything)
// - Else -> Partially Delivered
// ---------------------------------------------------------------------
export const deliverSalesOrder = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const order = await SalesOrder.findById(req.params.id).session(session);
    if (!order) throw new Error("Sales Order not found");

    if (!["Confirmed", "Partially Delivered"].includes(order.status)) {
      throw new Error("Only Confirmed or Partially Delivered orders can be delivered");
    }

    const before = order.toObject();
    const { products: deliveryUpdates } = req.body; // [{ product_id, delivered_quantity }]

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
        throw new Error(
          `Delivered quantity cannot decrease for ${line.product_name}`
        );
      }
      if (newDelivered > line.ordered_quantity) {
        throw new Error(
          `Delivered quantity cannot exceed ordered quantity for ${line.product_name}`
        );
      }

      const delta = newDelivered - line.delivered_quantity;

      if (delta > 0) {
        // Decrease physical stock
        await recordStockMovement({
          product_id: line.product_id,
          transaction_type: "sales_delivery",
          quantity: -delta,
          reference_type: "SalesOrder",
          reference_id: order._id,
          notes: `Delivered ${delta} of ${line.product_name} for ${order.so_number}`,
          created_by: req.body.user_id || null,
          session,
        });

        // Release reservation for the delivered portion
        await updateReservedQty(line.product_id, -delta, session);
      }

      line.delivered_quantity = newDelivered;
    }

    // Determine overall status
    const allFullyDelivered = order.products.every(
      (line) => line.delivered_quantity === line.ordered_quantity
    );

    order.status = allFullyDelivered ? "Fully Delivered" : "Partially Delivered";
    await order.save({ session });

    await writeFieldChangeLogs({
      module: "Sales",
      record_id: order._id,
      record_reference: order.so_number,
      before,
      after: order.toObject(),
      fieldsToTrack: ["status", "products"],
      user: req.body.user_id || null,
      session,
    });

    await session.commitTransaction();
    res.json({ success: true, data: order });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};

// ---------------------------------------------------------------------
// CANCEL - any non-final status -> Cancelled
// - Release any reserved quantity
// ---------------------------------------------------------------------
export const cancelSalesOrder = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const order = await SalesOrder.findById(req.params.id).session(session);
    if (!order) throw new Error("Sales Order not found");

    if (["Fully Delivered", "Cancelled"].includes(order.status)) {
      throw new Error(`Cannot cancel an order that is ${order.status}`);
    }

    const before = order.toObject();

    // Release reservations for the un-delivered portion of each line
    if (["Confirmed", "Partially Delivered"].includes(order.status)) {
      for (const line of order.products) {
        const remaining = line.ordered_quantity - line.delivered_quantity;
        if (remaining > 0) {
          await updateReservedQty(line.product_id, -remaining, session);
        }
      }
    }

    order.status = "Cancelled";
    await order.save({ session });

    await writeFieldChangeLogs({
      module: "Sales",
      record_id: order._id,
      record_reference: order.so_number,
      before,
      after: order.toObject(),
      fieldsToTrack: ["status"],
      user: req.body.user_id || null,
      session,
    });

    await session.commitTransaction();
    res.json({ success: true, data: order });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};

// ---------------------------------------------------------------------
// DELETE - only Draft orders can be deleted
// ---------------------------------------------------------------------
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
      user: req.body.user_id || null,
    });

    res.json({ success: true, message: "Sales Order deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
