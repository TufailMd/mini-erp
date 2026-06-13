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
  session = null,
}) => {
  const product = await Product.findById(product_id).session(session);
  if (!product) throw new Error("Product not found");

  const newBalance = product.on_hand_qty + quantity;
  if (newBalance < 0) throw new Error(`Insufficient stock for product ${product.name}`);

  product.on_hand_qty = newBalance;
  await product.save({ session });

  const ledgerEntry = await StockLedger.create(
    [
      {
        product_id,
        transaction_type,
        quantity,
        balance_after: newBalance,
        reference_type,
        reference_id,
        notes,
        created_by,
      },
    ],
    { session }
  );

  return { product, ledger: ledgerEntry[0] };
};

export const updateReservedQty = async (product_id, delta, session = null) => {
  const product = await Product.findById(product_id).session(session);
  if (!product) throw new Error("Product not found");

  product.reserved_qty = Math.max(0, product.reserved_qty + delta);
  await product.save({ session });

  return product;
};