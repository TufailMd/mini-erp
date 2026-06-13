import mongoose from "mongoose";
import Bom from "../models/bom.model.js";
import Product from "../models/product.model.js";
import { getNextSequence, formatReference } from "../models/counter.model.js";
import { writeAuditLog, writeFieldChangeLogs } from "../utils/auditLogHelper.js";

const TRACKED_FIELDS = [
  "finished_product_id",
  "finished_product_name",
  "quantity",
  "units",
  "reference",
  "components",
  "operations",
  "is_active",
];

export const createBom = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { finished_product_id, quantity, units, reference, components, operations } =
      req.body;

    if (!finished_product_id) throw new Error("Finished product is required");
    if (!components || components.length === 0) {
      throw new Error("At least one component is required");
    }

    const finishedProduct = await Product.findById(finished_product_id).session(session);
    if (!finishedProduct) throw new Error("Finished product not found");

    const componentItems = [];
    for (const item of components) {
      const componentProduct = await Product.findById(
        item.component_product_id
      ).session(session);
      if (!componentProduct) {
        throw new Error(`Component product not found: ${item.component_product_id}`);
      }

      componentItems.push({
        component_product_id: componentProduct._id,
        component_name: componentProduct.name,
        to_consume_qty: item.to_consume_qty,
        units: item.units || "Units",
      });
    }

    const operationItems = (operations || []).map((op) => ({
      operation_name: op.operation_name,
      work_center: op.work_center,
      expected_duration: op.expected_duration,
    }));

    const seq = await getNextSequence("bom", session);
    const bom_number = formatReference("BOM", seq);

    const bom = await Bom.create(
      [
        {
          bom_number,
          finished_product_id: finishedProduct._id,
          finished_product_name: finishedProduct.name,
          quantity,
          units: units || "Units",
          reference,
          components: componentItems,
          operations: operationItems,
        },
      ],
      { session }
    );

    await writeAuditLog({
      module: "BoM",
      record_id: bom[0]._id,
      record_reference: bom_number,
      action: "Created",
      user: req.body.user_id || null,
      session,
    });

    await session.commitTransaction();
    res.status(201).json({ success: true, data: bom[0] });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};

export const getBoms = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { bom_number: { $regex: search, $options: "i" } },
        { finished_product_name: { $regex: search, $options: "i" } },
        { reference: { $regex: search, $options: "i" } },
      ];
    }

    const boms = await Bom.find(filter)
      .populate("finished_product_id", "name sku")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Bom.countDocuments(filter);

    res.json({ success: true, data: boms, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getBomById = async (req, res) => {
  try {
    const bom = await Bom.findById(req.params.id).populate(
      "finished_product_id",
      "name sku sales_price cost_price"
    );

    if (!bom) {
      return res.status(404).json({ success: false, message: "BoM not found" });
    }

    res.json({ success: true, data: bom });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateBom = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const bom = await Bom.findById(req.params.id).session(session);
    if (!bom) throw new Error("BoM not found");

    const before = bom.toObject();

    const {
      finished_product_id,
      quantity,
      units,
      reference,
      components,
      operations,
      is_active,
    } = req.body;

    if (finished_product_id !== undefined) {
      const finishedProduct = await Product.findById(finished_product_id).session(
        session
      );
      if (!finishedProduct) throw new Error("Finished product not found");
      bom.finished_product_id = finishedProduct._id;
      bom.finished_product_name = finishedProduct.name;
    }

    if (quantity !== undefined) bom.quantity = quantity;
    if (units !== undefined) bom.units = units;
    if (reference !== undefined) bom.reference = reference;
    if (is_active !== undefined) bom.is_active = is_active;

    if (components !== undefined) {
      if (components.length === 0) {
        throw new Error("At least one component is required");
      }

      const componentItems = [];
      for (const item of components) {
        const componentProduct = await Product.findById(
          item.component_product_id
        ).session(session);
        if (!componentProduct) {
          throw new Error(`Component product not found: ${item.component_product_id}`);
        }

        componentItems.push({
          component_product_id: componentProduct._id,
          component_name: componentProduct.name,
          to_consume_qty: item.to_consume_qty,
          units: item.units || "Units",
        });
      }
      bom.components = componentItems;
    }

    if (operations !== undefined) {
      bom.operations = operations.map((op) => ({
        operation_name: op.operation_name,
        work_center: op.work_center,
        expected_duration: op.expected_duration,
      }));
    }

    await bom.save({ session });

    await writeFieldChangeLogs({
      module: "BoM",
      record_id: bom._id,
      record_reference: bom.bom_number,
      before,
      after: bom.toObject(),
      fieldsToTrack: TRACKED_FIELDS,
      user: req.body.user_id || null,
      session,
    });

    await session.commitTransaction();
    res.json({ success: true, data: bom });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};

export const deleteBom = async (req, res) => {
  try {
    const bom = await Bom.findById(req.params.id);
    if (!bom) {
      return res.status(404).json({ success: false, message: "BoM not found" });
    }

    await Bom.findByIdAndDelete(req.params.id);

    await writeAuditLog({
      module: "BoM",
      record_id: bom._id,
      record_reference: bom.bom_number,
      action: "Deleted",
      user: req.body.user_id || null,
    });

    res.json({ success: true, message: "BoM deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
