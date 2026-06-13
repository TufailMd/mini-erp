import mongoose from "mongoose";
import ManufacturingOrder from "../models/manufacturingOrder.model.js";
import Product from "../models/product.model.js";
import Bom from "../models/bom.model.js";
import { getNextSequence, formatReference } from "../models/counter.model.js";
import {
  recordStockMovement,
  updateReservedQty,
  getFreeQty,
} from "../utils/stockHelper.js";
import { writeAuditLog, writeFieldChangeLogs } from "../utils/auditLogHelper.js";

const TRACKED_FIELDS = [
  "finished_product_id",
  "finished_product_name",
  "quantity",
  "units",
  "schedule_date",
  "assignee",
  "bom_id",
  "status",
  "components",
  "operations",
];

const buildLinesFromBom = async (bom, moQuantity, session) => {
  const scaleFactor = moQuantity / bom.quantity;

  const components = [];
  for (const comp of bom.components) {
    const product = await Product.findById(comp.component_product_id).session(session);
    const freeQty = product
      ? (product.on_hand_qty || 0) - (product.reserved_qty || 0)
      : 0;

    components.push({
      product_id: comp.component_product_id,
      product_name: comp.component_name,
      availability: freeQty,
      to_consume_qty: comp.to_consume_qty * scaleFactor,
      consumed_qty: 0,
      units: comp.units || "Units",
    });
  }

  const operations = bom.operations.map((op) => ({
    operation_name: op.operation_name,
    work_center: op.work_center,
    expected_duration: op.expected_duration * scaleFactor,
    real_duration: 0,
  }));

  return { components, operations };
};


export const createManufacturingOrder = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const {
      finished_product_id,
      quantity,
      units,
      schedule_date,
      assignee,
      bom_id,
      components,
      operations,
    } = req.body;

    if (!finished_product_id) throw new Error("Finished product is required");
    if (!quantity || quantity <= 0) throw new Error("Quantity must be greater than 0");

    const finishedProduct = await Product.findById(finished_product_id).session(session);
    if (!finishedProduct) throw new Error("Finished product not found");

    let lineComponents = [];
    let lineOperations = [];

    if (bom_id) {
      const bom = await Bom.findById(bom_id).session(session);
      if (!bom) throw new Error("BoM not found");

      if (bom.finished_product_id.toString() !== finished_product_id.toString()) {
        throw new Error("Selected BoM does not match the finished product");
      }

      const built = await buildLinesFromBom(bom, quantity, session);
      lineComponents = built.components;
      lineOperations = built.operations;
    } else {

      if (components && components.length > 0) {
        for (const item of components) {
          const product = await Product.findById(item.product_id).session(session);
          if (!product) throw new Error(`Component product not found: ${item.product_id}`);

          const freeQty = (product.on_hand_qty || 0) - (product.reserved_qty || 0);

          lineComponents.push({
            product_id: product._id,
            product_name: product.name,
            availability: freeQty,
            to_consume_qty: item.to_consume_qty,
            consumed_qty: 0,
            units: item.units || "Units",
          });
        }
      }

      if (operations && operations.length > 0) {
        lineOperations = operations.map((op) => ({
          operation_name: op.operation_name,
          work_center: op.work_center,
          expected_duration: op.expected_duration,
          real_duration: 0,
        }));
      }
    }

    const seq = await getNextSequence("manufacturing_order", session);
    const mo_number = formatReference("MO", seq);

    const mo = await ManufacturingOrder.create(
      [
        {
          mo_number,
          finished_product_id: finishedProduct._id,
          finished_product_name: finishedProduct.name,
          quantity,
          units: units || "Units",
          schedule_date,
          assignee,
          bom_id: bom_id || null,
          status: "Draft",
          components: lineComponents,
          operations: lineOperations,
        },
      ],
      { session }
    );

    await writeAuditLog({
      module: "Manufacturing",
      record_id: mo[0]._id,
      record_reference: mo_number,
      action: "Created",
      user: req.body.user_id || null,
      session,
    });

    await session.commitTransaction();
    res.status(201).json({ success: true, data: mo[0] });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};


export const getManufacturingOrders = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { mo_number: { $regex: search, $options: "i" } },
        { finished_product_name: { $regex: search, $options: "i" } },
      ];
    }

    const orders = await ManufacturingOrder.find(filter)
      .populate("assignee", "name email")
      .populate("bom_id", "bom_number")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await ManufacturingOrder.countDocuments(filter);

    res.json({ success: true, data: orders, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getManufacturingOrderById = async (req, res) => {
  try {
    const order = await ManufacturingOrder.findById(req.params.id)
      .populate("assignee", "name email")
      .populate("bom_id", "bom_number reference");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Manufacturing Order not found" });
    }

    const componentsWithAvailability = await Promise.all(
      order.components.map(async (line) => {
        const freeQty = await getFreeQty(line.product_id);
        return { ...line.toObject(), availability: freeQty };
      })
    );

    res.json({
      success: true,
      data: { ...order.toObject(), components: componentsWithAvailability },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const updateManufacturingOrder = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const order = await ManufacturingOrder.findById(req.params.id).session(session);
    if (!order) throw new Error("Manufacturing Order not found");

    if (order.status !== "Draft") {
      throw new Error("Only Draft orders can be edited");
    }

    const before = order.toObject();

    const {
      finished_product_id,
      quantity,
      units,
      schedule_date,
      assignee,
      bom_id,
      components,
      operations,
    } = req.body;

    let finishedProductId = order.finished_product_id;

    if (finished_product_id !== undefined) {
      const finishedProduct = await Product.findById(finished_product_id).session(
        session
      );
      if (!finishedProduct) throw new Error("Finished product not found");
      order.finished_product_id = finishedProduct._id;
      order.finished_product_name = finishedProduct.name;
      finishedProductId = finishedProduct._id;
    }

    if (units !== undefined) order.units = units;
    if (schedule_date !== undefined) order.schedule_date = schedule_date;
    if (assignee !== undefined) order.assignee = assignee;

    const newQuantity = quantity !== undefined ? quantity : order.quantity;
    if (quantity !== undefined) {
      if (quantity <= 0) throw new Error("Quantity must be greater than 0");
      order.quantity = quantity;
    }


    const bomChanged = bom_id !== undefined && String(bom_id) !== String(order.bom_id);
    const quantityChanged = quantity !== undefined && quantity !== before.quantity;

    if (bom_id !== undefined) {
      if (bom_id) {
        const bom = await Bom.findById(bom_id).session(session);
        if (!bom) throw new Error("BoM not found");

        if (bom.finished_product_id.toString() !== finishedProductId.toString()) {
          throw new Error("Selected BoM does not match the finished product");
        }
        order.bom_id = bom._id;
      } else {
        order.bom_id = null;
      }
    }

    if (order.bom_id && (bomChanged || quantityChanged)) {
      const bom = await Bom.findById(order.bom_id).session(session);
      const built = await buildLinesFromBom(bom, newQuantity, session);
      order.components = built.components;
      order.operations = built.operations;
    } else {

      if (components !== undefined) {
        const lineComponents = [];
        for (const item of components) {
          const product = await Product.findById(item.product_id).session(session);
          if (!product) {
            throw new Error(`Component product not found: ${item.product_id}`);
          }
          const freeQty = (product.on_hand_qty || 0) - (product.reserved_qty || 0);

          lineComponents.push({
            product_id: product._id,
            product_name: product.name,
            availability: freeQty,
            to_consume_qty: item.to_consume_qty,
            consumed_qty: item.consumed_qty || 0,
            units: item.units || "Units",
          });
        }
        order.components = lineComponents;
      }

      if (operations !== undefined) {
        order.operations = operations.map((op) => ({
          operation_name: op.operation_name,
          work_center: op.work_center,
          expected_duration: op.expected_duration,
          real_duration: op.real_duration || 0,
        }));
      }
    }

    await order.save({ session });

    await writeFieldChangeLogs({
      module: "Manufacturing",
      record_id: order._id,
      record_reference: order.mo_number,
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

export const confirmManufacturingOrder = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const order = await ManufacturingOrder.findById(req.params.id).session(session);
    if (!order) throw new Error("Manufacturing Order not found");

    if (order.status !== "Draft") {
      throw new Error("Only Draft orders can be confirmed");
    }

    if (!order.components || order.components.length === 0) {
      throw new Error("At least one component is required before confirming");
    }

    const before = order.toObject();


    for (const line of order.components) {
      await updateReservedQty(line.product_id, line.to_consume_qty, session);
    }

    order.status = "Confirmed";
    await order.save({ session });

    await writeFieldChangeLogs({
      module: "Manufacturing",
      record_id: order._id,
      record_reference: order.mo_number,
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


export const startManufacturingOrder = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const order = await ManufacturingOrder.findById(req.params.id).session(session);
    if (!order) throw new Error("Manufacturing Order not found");

    if (order.status !== "Confirmed") {
      throw new Error("Only Confirmed orders can be started");
    }

    const before = order.toObject();

    order.status = "In Progress";
    await order.save({ session });

    await writeFieldChangeLogs({
      module: "Manufacturing",
      record_id: order._id,
      record_reference: order.mo_number,
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


export const updateManufacturingProgress = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const order = await ManufacturingOrder.findById(req.params.id).session(session);
    if (!order) throw new Error("Manufacturing Order not found");

    if (!["Confirmed", "In Progress"].includes(order.status)) {
      throw new Error(
        "Components and operations can only be updated when MO is Confirmed or In Progress"
      );
    }

    const before = order.toObject();
    const { components, operations } = req.body;

    if (components) {
      for (const update of components) {
        const line = order.components.find(
          (c) => c.product_id.toString() === update.product_id.toString()
        );
        if (!line) continue;
        if (update.consumed_qty !== undefined) {
          line.consumed_qty = update.consumed_qty;
        }
      }
    }

    if (operations) {
      for (const update of operations) {
        const op = order.operations.find(
          (o) => o.operation_name === update.operation_name
        );
        if (!op) continue;
        if (update.real_duration !== undefined) {
          op.real_duration = update.real_duration;
        }
      }
    }

    await order.save({ session });

    await writeFieldChangeLogs({
      module: "Manufacturing",
      record_id: order._id,
      record_reference: order.mo_number,
      before,
      after: order.toObject(),
      fieldsToTrack: ["components", "operations"],
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

export const produceManufacturingOrder = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const order = await ManufacturingOrder.findById(req.params.id).session(session);
    if (!order) throw new Error("Manufacturing Order not found");

    if (!["Confirmed", "In Progress"].includes(order.status)) {
      throw new Error("Only Confirmed or In Progress orders can be produced");
    }

    const before = order.toObject();

    // Consume components
    for (const line of order.components) {
      const consumeQty =
        line.consumed_qty && line.consumed_qty > 0
          ? line.consumed_qty
          : line.to_consume_qty;

      // Release the reservation
      await updateReservedQty(line.product_id, -line.to_consume_qty, session);

      // Deduct from physical stock
      await recordStockMovement({
        product_id: line.product_id,
        transaction_type: "manufacturing_consume",
        quantity: -consumeQty,
        reference_type: "ManufacturingOrder",
        reference_id: order._id,
        notes: `Consumed ${consumeQty} of ${line.product_name} for ${order.mo_number}`,
        created_by: req.body.user_id || null,
        session,
      });

      line.consumed_qty = consumeQty;
    }

    // Produce finished goods
    await recordStockMovement({
      product_id: order.finished_product_id,
      transaction_type: "manufacturing_produce",
      quantity: order.quantity,
      reference_type: "ManufacturingOrder",
      reference_id: order._id,
      notes: `Produced ${order.quantity} of ${order.finished_product_name} for ${order.mo_number}`,
      created_by: req.body.user_id || null,
      session,
    });

    order.status = "Done";
    await order.save({ session });

    await writeFieldChangeLogs({
      module: "Manufacturing",
      record_id: order._id,
      record_reference: order.mo_number,
      before,
      after: order.toObject(),
      fieldsToTrack: ["status", "components"],
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


export const cancelManufacturingOrder = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const order = await ManufacturingOrder.findById(req.params.id).session(session);
    if (!order) throw new Error("Manufacturing Order not found");

    if (["Done", "Cancelled"].includes(order.status)) {
      throw new Error(`Cannot cancel an order that is ${order.status}`);
    }

    const before = order.toObject();


    if (["Confirmed", "In Progress"].includes(order.status)) {
      for (const line of order.components) {
        await updateReservedQty(line.product_id, -line.to_consume_qty, session);
      }
    }

    order.status = "Cancelled";
    await order.save({ session });

    await writeFieldChangeLogs({
      module: "Manufacturing",
      record_id: order._id,
      record_reference: order.mo_number,
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


export const deleteManufacturingOrder = async (req, res) => {
  try {
    const order = await ManufacturingOrder.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Manufacturing Order not found" });
    }

    if (order.status !== "Draft") {
      return res
        .status(400)
        .json({ success: false, message: "Only Draft orders can be deleted" });
    }

    await ManufacturingOrder.findByIdAndDelete(req.params.id);

    await writeAuditLog({
      module: "Manufacturing",
      record_id: order._id,
      record_reference: order.mo_number,
      action: "Deleted",
      user: req.body.user_id || null,
    });

    res.json({ success: true, message: "Manufacturing Order deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
