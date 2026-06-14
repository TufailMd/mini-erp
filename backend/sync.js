
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const productSchema = new mongoose.Schema({ on_hand_qty: Number, name: String });
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const userSchema = new mongoose.Schema({ email: String });
const User = mongoose.models.User || mongoose.model('User', userSchema);

const stockLedgerSchema = new mongoose.Schema({ product_id: mongoose.Schema.Types.ObjectId, quantity: Number, balance_after: Number, transaction_type: String, reference_type: String, reference_id: mongoose.Schema.Types.ObjectId, notes: String, created_by: mongoose.Schema.Types.ObjectId }, { timestamps: true });
const StockLedger = mongoose.models.StockLedger || mongoose.model('StockLedger', stockLedgerSchema);

async function sync() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected');
  
  const admin = await User.findOne({ email: 'admin@nexuserp.com' });

  const products = await Product.find({ on_hand_qty: { $gt: 0 } });
  console.log('Found ' + products.length + ' products with on-hand qty > 0');
  
  let added = 0;
  for (const p of products) {
    const existing = await StockLedger.findOne({ product_id: p._id });
    if (!existing) {
      await StockLedger.create({
        product_id: p._id,
        transaction_type: 'manual_adjustment',
        quantity: p.on_hand_qty,
        balance_after: p.on_hand_qty,
        reference_type: 'Manual',
        reference_id: p._id,
        notes: 'Initial stock sync',
        created_by: admin ? admin._id : new mongoose.Types.ObjectId()
      });
      added++;
    }
  }
  console.log('Added ' + added + ' missing ledger entries.');
  await mongoose.disconnect();
}
sync().catch(console.error);

