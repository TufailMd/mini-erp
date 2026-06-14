/**
 * Full data seed script for NexusERP
 * Seeds: Users, Vendors, Products, BOMs, Sales Orders, Purchase Orders, Manufacturing Orders
 * Run: node seedData.js
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

// ─── Inline lightweight models (avoids CJS/ESM conflicts) ───────────────────

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, default: "SALES_USER" },
}, { timestamps: true });
const User = mongoose.models.User || mongoose.model("User", userSchema);

const vendorSchema = new mongoose.Schema({
  name: String,
  vendor_address: String,
  responsible_person: String,
  email: String,
  phone: String,
  is_active: { type: Boolean, default: true }
}, { timestamps: true });
const Vendor = mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);

const productSchema = new mongoose.Schema({
  name: String, sku: { type: String, uppercase: true, unique: true },
  sales_price: { type: Number, default: 0 }, cost_price: { type: Number, default: 0 },
  on_hand_qty: { type: Number, default: 0 }, reserved_qty: { type: Number, default: 0 },
  low_stock_threshold: { type: Number, default: 10 },
  procurement_strategy: { type: String, default: "MTS" },
  procure_on_demand: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  image: { filename: { type: String, default: "listingimage" }, url: { type: String, default: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=400" } },
}, { timestamps: true });
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

const counterSchema = new mongoose.Schema({ _id: String, seq: { type: Number, default: 0 } });
const Counter = mongoose.models.Counter || mongoose.model("Counter", counterSchema);
const getNextSeq = async (name) => {
  const c = await Counter.findByIdAndUpdate(name, { $inc: { seq: 1 } }, { new: true, upsert: true });
  return String(c.seq).padStart(6, "0");
};

const bomCompSchema = new mongoose.Schema({ component_product_id: mongoose.Schema.Types.ObjectId, component_name: String, to_consume_qty: Number, units: { type: String, default: "Units" } }, { _id: false });
const bomOpSchema = new mongoose.Schema({ operation_name: String, work_center: String, expected_duration: Number }, { _id: false });
const bomSchema = new mongoose.Schema({ bom_number: { type: String, unique: true }, finished_product_id: mongoose.Schema.Types.ObjectId, finished_product_name: String, quantity: Number, units: { type: String, default: "Units" }, components: [bomCompSchema], operations: [bomOpSchema], is_active: { type: Boolean, default: true } }, { timestamps: true });
const Bom = mongoose.models.Bom || mongoose.model("Bom", bomSchema);

const soLineSchema = new mongoose.Schema({ product_id: mongoose.Schema.Types.ObjectId, product_name: String, availability: Number, ordered_quantity: Number, delivered_quantity: { type: Number, default: 0 }, units: { type: String, default: "Units" }, sales_unit_price: Number }, { _id: false });
const soSchema = new mongoose.Schema({ so_number: { type: String, unique: true }, customer: String, customer_address: String, sales_person: mongoose.Schema.Types.ObjectId, status: { type: String, default: "Draft" }, products: [soLineSchema] }, { timestamps: true });
const SalesOrder = mongoose.models.SalesOrder || mongoose.model("SalesOrder", soSchema);

const poLineSchema = new mongoose.Schema({ product_id: mongoose.Schema.Types.ObjectId, product_name: String, ordered_quantity: Number, received_quantity: { type: Number, default: 0 }, units: { type: String, default: "Units" }, cost_price: Number }, { _id: false });
const poSchema = new mongoose.Schema({ po_number: { type: String, unique: true }, vendor_id: mongoose.Schema.Types.ObjectId, vendor_name: String, vendor_address: String, status: { type: String, default: "Draft" }, products: [poLineSchema] }, { timestamps: true });
const PurchaseOrder = mongoose.models.PurchaseOrder || mongoose.model("PurchaseOrder", poSchema);

const moCompSchema = new mongoose.Schema({ product_id: mongoose.Schema.Types.ObjectId, product_name: String, to_consume_qty: Number, consumed_qty: { type: Number, default: 0 }, units: { type: String, default: "Units" }, availability: Number }, { _id: false });
const moOpSchema = new mongoose.Schema({ operation_name: String, work_center: String, expected_duration: Number, real_duration: { type: Number, default: 0 } }, { _id: false });
const moSchema = new mongoose.Schema({ mo_number: { type: String, unique: true }, finished_product_id: mongoose.Schema.Types.ObjectId, finished_product_name: String, quantity: Number, units: { type: String, default: "Units" }, bom_id: mongoose.Schema.Types.ObjectId, status: { type: String, default: "Draft" }, components: [moCompSchema], operations: [moOpSchema], schedule_date: Date }, { timestamps: true });
const ManufacturingOrder = mongoose.models.ManufacturingOrder || mongoose.model("ManufacturingOrder", moSchema);

// Helper to safely drop a collection (and all its old indexes)
async function dropCollection(name) {
  try {
    await mongoose.connection.db.dropCollection(name);
    console.log(`   ✓ Dropped collection and indexes: ${name}`);
  } catch (err) {
    // Collection doesn't exist, ignore error
  }
}

// ─── Main seed ────────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected\n");

  // Clean all collections to ensure fresh indexes
  console.log("🧹 Cleaning old collections...");
  await dropCollection("users");
  await dropCollection("vendors");
  await dropCollection("products");
  await dropCollection("boms");
  await dropCollection("salesorders");
  await dropCollection("purchaseorders");
  await dropCollection("manufacturingorders");
  await dropCollection("counters");

  // ── 0. Admin User ──────────────────────────────────────────────────────────
  console.log("👤 Seeding admin user...");
  const hashedPassword = await bcrypt.hash("Admin@1234", 10);
  const adminUser = await User.create({
    name: "System Admin",
    email: "admin@nexuserp.com",
    password: hashedPassword,
    role: "ADMIN"
  });
  console.log(`   ✓ Admin user created: admin@nexuserp.com / Admin@1234`);

  // ── 1. Vendors ─────────────────────────────────────────────────────────────
  console.log("🏭 Seeding vendors...");
  const vendors = await Vendor.insertMany([
    { name: "RawMat Supplies Pvt Ltd",   vendor_address: "12 Industrial Area, Pune, MH 411001", responsible_person: "Ravi Kumar",   email: "ravi@rawmat.in",    phone: "+91-98200-11111" },
    { name: "TechParts Global",           vendor_address: "45 Sector 18, Gurugram, HR 122001",   responsible_person: "Priya Mehta",  email: "priya@techparts.io", phone: "+91-98200-22222" },
    { name: "PackRight Solutions",        vendor_address: "78 Anna Salai, Chennai, TN 600002",   responsible_person: "Suresh Nair",  email: "suresh@packright.co",phone: "+91-98200-33333" },
    { name: "ChemBase Industries",        vendor_address: "33 GIDC, Vadodara, GJ 390010",        responsible_person: "Anita Shah",   email: "anita@chembase.in",  phone: "+91-98200-44444" },
    { name: "Electra Components Ltd",     vendor_address: "9 Whitefield, Bengaluru, KA 560066",  responsible_person: "Kiran Reddy", email: "kiran@electra.co.in",phone: "+91-98200-55555" },
  ]);
  console.log(`   ✓ ${vendors.length} vendors created`);

  // ── 2. Products ────────────────────────────────────────────────────────────
  console.log("📦 Seeding products...");
  const products = await Product.insertMany([
    // Finished goods
    { name: "Bluetooth Speaker Pro",  sku: "BSP-001", sales_price: 2499, cost_price: 1200, on_hand_qty: 85,  reserved_qty: 10, low_stock_threshold: 20, procurement_strategy: "MTS" },
    { name: "Wireless Earbuds X1",    sku: "WEX-002", sales_price: 1799, cost_price: 900,  on_hand_qty: 120, reserved_qty: 30, low_stock_threshold: 25, procurement_strategy: "MTS" },
    { name: "Smart LED Desk Lamp",    sku: "SLD-003", sales_price: 1299, cost_price: 650,  on_hand_qty: 200, reserved_qty: 15, low_stock_threshold: 30, procurement_strategy: "MTS" },
    { name: "Portable Power Bank 20K",sku: "PPB-004", sales_price: 750,  cost_price: 750,  on_hand_qty: 60,  reserved_qty: 20, low_stock_threshold: 15, procurement_strategy: "MTS" },
    { name: "USB-C Hub 7-in-1",       sku: "UCH-005", sales_price: 1999, cost_price: 950,  on_hand_qty: 45,  reserved_qty: 5,  low_stock_threshold: 10, procurement_strategy: "MTS" },
    // Raw materials / components
    { name: "Lithium Battery Cell",   sku: "LBC-101", sales_price: 0,    cost_price: 180,  on_hand_qty: 500, reserved_qty: 80, low_stock_threshold: 100, procurement_strategy: "MTS" },
    { name: "Bluetooth Chip v5.3",    sku: "BTC-102", sales_price: 0,    cost_price: 320,  on_hand_qty: 300, reserved_qty: 60, low_stock_threshold: 50,  procurement_strategy: "MTS" },
    { name: "Speaker Driver 40mm",    sku: "SPD-103", sales_price: 0,    cost_price: 220,  on_hand_qty: 400, reserved_qty: 70, low_stock_threshold: 80,  procurement_strategy: "MTS" },
    { name: "PCB Assembly Board",     sku: "PAB-104", sales_price: 0,    cost_price: 280,  on_hand_qty: 250, reserved_qty: 40, low_stock_threshold: 60,  procurement_strategy: "MTS" },
    { name: "ABS Plastic Housing",    sku: "APH-105", sales_price: 0,    cost_price: 90,   on_hand_qty: 600, reserved_qty: 100,low_stock_threshold: 120, procurement_strategy: "MTS" },
    { name: "LED Strip 1m",           sku: "LDS-106", sales_price: 0,    cost_price: 75,   on_hand_qty: 800, reserved_qty: 50, low_stock_threshold: 200, procurement_strategy: "MTS" },
    { name: "USB-C Port Connector",   sku: "UPC-107", sales_price: 0,    cost_price: 45,   on_hand_qty: 1000,reserved_qty: 120,low_stock_threshold: 200, procurement_strategy: "MTS" },
  ]);
  console.log(`   ✓ ${products.length} products created`);

  const [spk, ear, lamp, pb, hub, bat, bt, drv, pcb, abs, led, usc] = products;

  // ── 3. BOMs ────────────────────────────────────────────────────────────────
  console.log("🔧 Seeding BOMs...");
  const boms = await Bom.insertMany([
    {
      bom_number: `BOM-${await getNextSeq("bom")}`,
      finished_product_id: spk._id, finished_product_name: spk.name, quantity: 1,
      components: [
        { component_product_id: bat._id, component_name: bat.name, to_consume_qty: 2, units: "Units" },
        { component_product_id: bt._id,  component_name: bt.name,  to_consume_qty: 1, units: "Units" },
        { component_product_id: drv._id, component_name: drv.name, to_consume_qty: 2, units: "Units" },
        { component_product_id: abs._id, component_name: abs.name, to_consume_qty: 1, units: "Units" },
      ],
      operations: [
        { operation_name: "PCB Soldering",  work_center: "Assembly Line A", expected_duration: 30 },
        { operation_name: "Final Assembly", work_center: "Assembly Line B", expected_duration: 45 },
        { operation_name: "QA Testing",     work_center: "QC Station",      expected_duration: 20 },
      ],
    },
    {
      bom_number: `BOM-${await getNextSeq("bom")}`,
      finished_product_id: ear._id, finished_product_name: ear.name, quantity: 1,
      components: [
        { component_product_id: bat._id, component_name: bat.name, to_consume_qty: 1, units: "Units" },
        { component_product_id: bt._id,  component_name: bt.name,  to_consume_qty: 1, units: "Units" },
        { component_product_id: pcb._id, component_name: pcb.name, to_consume_qty: 1, units: "Units" },
      ],
      operations: [
        { operation_name: "Micro Assembly",  work_center: "Precision Line", expected_duration: 60 },
        { operation_name: "Acoustic Testing",work_center: "QC Station",     expected_duration: 25 },
      ],
    },
    {
      bom_number: `BOM-${await getNextSeq("bom")}`,
      finished_product_id: lamp._id, finished_product_name: lamp.name, quantity: 1,
      components: [
        { component_product_id: led._id, component_name: led.name, to_consume_qty: 3, units: "Units" },
        { component_product_id: pcb._id, component_name: pcb.name, to_consume_qty: 1, units: "Units" },
        { component_product_id: abs._id, component_name: abs.name, to_consume_qty: 1, units: "Units" },
      ],
      operations: [
        { operation_name: "LED Mounting", work_center: "Assembly Line A", expected_duration: 20 },
        { operation_name: "Wiring",       work_center: "Assembly Line B", expected_duration: 15 },
        { operation_name: "QA Testing",   work_center: "QC Station",      expected_duration: 10 },
      ],
    },
  ]);
  console.log(`   ✓ ${boms.length} BOMs created`);

  // ── 4. Sales Orders ────────────────────────────────────────────────────────
  console.log("🛒 Seeding sales orders...");
  const soData = [
    { customer: "Rahul Verma",    customer_address: "42 MG Road, Bengaluru, KA 560001", status: "Confirmed",          products: [ { product_id: spk._id, product_name: spk.name, ordered_quantity: 10, sales_unit_price: spk.sales_price, availability: 85, delivered_quantity: 0 }, { product_id: ear._id, product_name: ear.name, ordered_quantity: 5, sales_unit_price: ear.sales_price, availability: 120, delivered_quantity: 0 } ] },
    { customer: "Priya Sharma",   customer_address: "15 Saket, New Delhi, DL 110017",   status: "Partially Delivered",products: [ { product_id: lamp._id, product_name: lamp.name, ordered_quantity: 20, sales_unit_price: lamp.sales_price, availability: 200, delivered_quantity: 12 } ] },
    { customer: "Amit Patel",     customer_address: "7 CG Road, Ahmedabad, GJ 380009",  status: "Draft",              products: [ { product_id: pb._id, product_name: pb.name, ordered_quantity: 8, sales_unit_price: pb.sales_price, availability: 60, delivered_quantity: 0 }, { product_id: hub._id, product_name: hub.name, ordered_quantity: 4, sales_unit_price: hub.sales_price, availability: 45, delivered_quantity: 0 } ] },
    { customer: "Sita Devi",      customer_address: "Sector 21, Chandigarh, CH 160022",  status: "Fully Delivered",   products: [ { product_id: spk._id, product_name: spk.name, ordered_quantity: 5, sales_unit_price: spk.sales_price, availability: 85, delivered_quantity: 5 } ] },
    { customer: "Karan Malhotra", customer_address: "Park Street, Kolkata, WB 700016",   status: "Confirmed",         products: [ { product_id: ear._id, product_name: ear.name, ordered_quantity: 15, sales_unit_price: ear.sales_price, availability: 120, delivered_quantity: 0 }, { product_id: hub._id, product_name: hub.name, ordered_quantity: 3, sales_unit_price: hub.sales_price, availability: 45, delivered_quantity: 0 } ] },
    { customer: "Deepa Nair",     customer_address: "Marine Drive, Mumbai, MH 400002",   status: "Cancelled",         products: [ { product_id: pb._id, product_name: pb.name, ordered_quantity: 3, sales_unit_price: pb.sales_price, availability: 60, delivered_quantity: 0 } ] },
  ];
  const salesOrders = await SalesOrder.insertMany(
    await Promise.all(soData.map(async (o) => ({ ...o, so_number: `SO-${await getNextSeq("sales_order")}` })))
  );
  console.log(`   ✓ ${salesOrders.length} sales orders created`);

  // ── 5. Purchase Orders ─────────────────────────────────────────────────────
  console.log("📋 Seeding purchase orders...");
  const poData = [
    { vendor_id: vendors[0]._id, vendor_name: vendors[0].name, vendor_address: vendors[0].vendor_address, status: "Confirmed",         products: [ { product_id: bat._id, product_name: bat.name, ordered_quantity: 500, cost_price: bat.cost_price }, { product_id: abs._id, product_name: abs.name, ordered_quantity: 300, cost_price: abs.cost_price } ] },
    { vendor_id: vendors[1]._id, vendor_name: vendors[1].name, vendor_address: vendors[1].vendor_address, status: "Partially Received",products: [ { product_id: bt._id, product_name: bt.name, ordered_quantity: 200, cost_price: bt.cost_price, received_quantity: 100 }, { product_id: pcb._id, product_name: pcb.name, ordered_quantity: 150, cost_price: pcb.cost_price, received_quantity: 80 } ] },
    { vendor_id: vendors[4]._id, vendor_name: vendors[4].name, vendor_address: vendors[4].vendor_address, status: "Draft",             products: [ { product_id: usc._id, product_name: usc.name, ordered_quantity: 400, cost_price: usc.cost_price } ] },
    { vendor_id: vendors[2]._id, vendor_name: vendors[2].name, vendor_address: vendors[2].vendor_address, status: "Fully Received",    products: [ { product_id: abs._id, product_name: abs.name, ordered_quantity: 200, cost_price: abs.cost_price, received_quantity: 200 } ] },
    { vendor_id: vendors[3]._id, vendor_name: vendors[3].name, vendor_address: vendors[3].vendor_address, status: "Confirmed",         products: [ { product_id: led._id, product_name: led.name, ordered_quantity: 300, cost_price: led.cost_price } ] },
  ];
  const purchaseOrders = await PurchaseOrder.insertMany(
    await Promise.all(poData.map(async (o) => ({ ...o, po_number: `PO-${await getNextSeq("purchase_order")}` })))
  );
  console.log(`   ✓ ${purchaseOrders.length} purchase orders created`);

  // ── 6. Manufacturing Orders ────────────────────────────────────────────────
  console.log("⚙️  Seeding manufacturing orders...");
  const moData = [
    { finished_product_id: spk._id, finished_product_name: spk.name, quantity: 50, bom_id: boms[0]._id, status: "In Progress", schedule_date: new Date("2025-07-10"),
      components: [ { product_id: bat._id, product_name: bat.name, to_consume_qty: 100, consumed_qty: 60, availability: 420, units: "Units" }, { product_id: bt._id, product_name: bt.name, to_consume_qty: 50, consumed_qty: 30, availability: 240, units: "Units" }, { product_id: drv._id, product_name: drv.name, to_consume_qty: 100, consumed_qty: 50, availability: 330, units: "Units" } ],
      operations: [ { operation_name: "PCB Soldering", work_center: "Assembly Line A", expected_duration: 30, real_duration: 32 }, { operation_name: "Final Assembly", work_center: "Assembly Line B", expected_duration: 45, real_duration: 0 } ] },
    { finished_product_id: ear._id, finished_product_name: ear.name, quantity: 30, bom_id: boms[1]._id, status: "Confirmed",  schedule_date: new Date("2025-07-15"),
      components: [ { product_id: bat._id, product_name: bat.name, to_consume_qty: 30, consumed_qty: 0, availability: 420, units: "Units" }, { product_id: pcb._id, product_name: pcb.name, to_consume_qty: 30, consumed_qty: 0, availability: 210, units: "Units" } ],
      operations: [ { operation_name: "Micro Assembly", work_center: "Precision Line", expected_duration: 60, real_duration: 0 } ] },
    { finished_product_id: lamp._id, finished_product_name: lamp.name, quantity: 100, bom_id: boms[2]._id, status: "Draft",      schedule_date: new Date("2025-07-20"),
      components: [ { product_id: led._id, product_name: led.name, to_consume_qty: 300, consumed_qty: 0, availability: 750, units: "Units" }, { product_id: pcb._id, product_name: pcb.name, to_consume_qty: 100, consumed_qty: 0, availability: 210, units: "Units" } ],
      operations: [] },
    { finished_product_id: spk._id, finished_product_name: spk.name, quantity: 20, bom_id: boms[0]._id, status: "Done", schedule_date: new Date("2025-06-01"),
      components: [ { product_id: bat._id, product_name: bat.name, to_consume_qty: 40, consumed_qty: 40, availability: 420, units: "Units" }, { product_id: drv._id, product_name: drv.name, to_consume_qty: 40, consumed_qty: 40, availability: 330, units: "Units" } ],
      operations: [ { operation_name: "PCB Soldering", work_center: "Assembly Line A", expected_duration: 30, real_duration: 28 }, { operation_name: "QA Testing", work_center: "QC Station", expected_duration: 20, real_duration: 22 } ] },
  ];
  const manufacturingOrders = await ManufacturingOrder.insertMany(
    await Promise.all(moData.map(async (o) => ({ ...o, mo_number: `MO-${await getNextSeq("manufacturing_order")}` })))
  );
  console.log(`   ✓ ${manufacturingOrders.length} manufacturing orders created`);

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log("\n🎉 All data seeded successfully!");
  console.log("─────────────────────────────────────────");
  console.log(`  Users                : ${1}`);
  console.log(`  Vendors              : ${vendors.length}`);
  console.log(`  Products             : ${products.length}`);
  console.log(`  BOMs                 : ${boms.length}`);
  console.log(`  Sales Orders         : ${salesOrders.length}`);
  console.log(`  Purchase Orders      : ${purchaseOrders.length}`);
  console.log(`  Manufacturing Orders : ${manufacturingOrders.length}`);
  console.log("─────────────────────────────────────────");

  await mongoose.disconnect();
  console.log("🔌 Disconnected.");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  console.error(err);
  process.exit(1);
});
