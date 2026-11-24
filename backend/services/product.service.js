import Product from "../models/product.model.js";
import { recordStockMovement } from "./stock.service.js";

export const createProduct = async (productData, createdBy) => {
  const product = await Product.create(productData);

  if (productData.on_hand_qty && productData.on_hand_qty > 0) {
    await recordStockMovement({
      product_id: product._id,
      transaction_type: "manual_adjustment",
      quantity: productData.on_hand_qty,
      reference_type: "Manual",
      reference_id: product._id,
      notes: "Initial stock upon product creation",
      created_by: createdBy || null,
    });
  }

  return product;
};

export const getProducts = async (query) => {
  const { search, category_id, page = 1, limit = 20 } = query;
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } },
    ];
  }
  if (category_id) filter.category_id = category_id;

  const products = await Product.find(filter)
    .populate("category_id vendor_id bom_id")
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments(filter);

  return { products, total, page: Number(page) };
};

export const getProductById = async (id) =>
  Product.findById(id).populate("category_id vendor_id bom_id");

export const updateProduct = async (id, productData) => {
  const product = await Product.findById(id);
  if (!product) return null;

  Object.assign(product, productData);
  await product.save();

  return product;
};

export const deleteProduct = async (id) =>
  Product.findByIdAndDelete(id);
