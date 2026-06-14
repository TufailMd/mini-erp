import StockLedger from "../models/stockLedger.model.js";
import Product from "../models/product.model.js";

export const recordStockMovement = async ({
  product_id,
  transaction_type,
  quantity,
  reference_type,
  reference_id,
  notes,
  created_by,
}) => {
  const product = await Product.findById(product_id);
  if (!product) throw new Error("Product not found");

  const newBalance = product.on_hand_qty + quantity;
  if (newBalance < 0) throw new Error(`Insufficient stock for product ${product.name}`);

  product.on_hand_qty = newBalance;
  await product.save();

  const ledgerEntry = await StockLedger.create({
    product_id,
    transaction_type,
    quantity,
    balance_after: newBalance,
    reference_type,
    reference_id,
    notes,
    created_by,
  });

  return { product, ledger: ledgerEntry };
};

export const updateReservedQty = async (product_id, delta) => {
  const product = await Product.findById(product_id);
  if (!product) throw new Error("Product not found");

  product.reserved_qty = Math.max(0, (product.reserved_qty || 0) + delta);
  await product.save();

  return product;
};

/**
 * Returns the free-to-use quantity for a product:
 *   free = on_hand_qty - reserved_qty
 * Returns 0 if the product is not found.
 */
export const getFreeQty = async (product_id) => {
  const product = await Product.findById(product_id).lean();
  if (!product) return 0;
  return Math.max(0, (product.on_hand_qty || 0) - (product.reserved_qty || 0));
};