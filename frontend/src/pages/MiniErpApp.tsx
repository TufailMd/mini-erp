import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell,
  Boxes,
  Check,
  ChevronDown,
  ChevronRight,
  Factory,
  Grid3X3,
  Info,
  Layers,
  Package,
  Pencil,
  Plus,
  ScrollText,
  Search,
  ShoppingCart,
  Trash2,
  TriangleAlert,
  Truck,
  UserCircle2,
  Users,
  X,
  XCircle,
} from 'lucide-react';

type AccessLevel = 'full' | 'view' | 'none';
type ViewKey =
  | 'dashboard'
  | 'products'
  | 'sales'
  | 'purchase'
  | 'manufacturing'
  | 'bom'
  | 'stockLedger'
  | 'auditLogs'
  | 'users';

type UserRole =
  | 'Admin'
  | 'Sales User'
  | 'Purchase User'
  | 'Manufacturing User'
  | 'Inventory Manager'
  | 'Business Owner';

type ModuleAccess = Record<ViewKey, AccessLevel>;

type AppUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  access: ModuleAccess;
};

type Product = {
  id: string;
  name: string;
  salesPrice: number;
  costPrice: number;
  onHand: number;
  reserved: number;
  procureOnDemand: boolean;
  procurementType: 'Purchase' | 'Manufacturing';
  preferredVendor?: string;
  bomReference?: string;
};

type SalesOrderLine = {
  id: string;
  productId: string;
  orderedQty: number;
  unitPrice: number;
  deliveredQty: number;
};

type SalesStatus = 'Draft' | 'Confirmed' | 'Partially Delivered' | 'Fully Delivered' | 'Cancelled';

type SalesOrder = {
  id: string;
  customerName: string;
  customerAddress: string;
  mobileNumber: string;
  salesPerson: string;
  orderDate: string;
  lines: SalesOrderLine[];
  notes: string;
  total: number;
  status: SalesStatus;
};

type PurchaseOrderLine = {
  id: string;
  productId: string;
  qty: number;
  unitCost: number;
  receivedQty: number;
};

type PurchaseStatus = 'Draft' | 'Confirmed' | 'Partially Received' | 'Fully Received';

type PurchaseOrder = {
  id: string;
  vendorName: string;
  vendorAddress: string;
  responsiblePerson: string;
  orderDate: string;
  expectedDeliveryDate: string;
  lines: PurchaseOrderLine[];
  totalCost: number;
  status: PurchaseStatus;
  source: 'Manual' | 'Auto-Triggered';
};

type BomComponent = {
  id: string;
  productId: string;
  qty: number;
};

type BomOperation = {
  id: string;
  operationName: string;
  workCenter: string;
  durationMins: number;
};

type Bom = {
  id: string;
  finishedProductId: string;
  components: BomComponent[];
  operations: BomOperation[];
};

type WorkOrder = {
  id: string;
  operationName: string;
  workCenter: string;
  durationMins: number;
  status: 'Pending' | 'In Progress' | 'Done';
};

type ManufacturingStatus = 'Draft' | 'In Progress' | 'Completed' | 'Cancelled';

type ManufacturingOrder = {
  id: string;
  productId: string;
  qty: number;
  assignee: string;
  status: ManufacturingStatus;
  source: 'Manual' | 'Auto-Triggered';
  scheduledDate: string;
  bomId: string;
  workOrders: WorkOrder[];
};

type MovementType =
  | 'Sale Delivery'
  | 'Purchase Receipt'
  | 'Manufacturing Consumption'
  | 'Manufacturing Production';

type StockLedgerEntry = {
  id: string;
  date: string;
  productId: string;
  movementType: MovementType;
  qtyChange: number;
  resultingBalance: number;
  reference: string;
  user: string;
};

type AuditAction = 'Created' | 'Updated' | 'Deleted' | 'Confirmed' | 'Delivered' | 'Completed';

type AuditLog = {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  module: string;
  action: AuditAction;
  recordId: string;
  oldValue?: unknown;
  newValue?: unknown;
};

type Toast = {
  id: string;
  kind: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
};

const ROLE_ACCESS: Record<UserRole, ModuleAccess> = {
  Admin: {
    dashboard: 'full',
    products: 'full',
    sales: 'full',
    purchase: 'full',
    manufacturing: 'full',
    bom: 'full',
    stockLedger: 'full',
    auditLogs: 'full',
    users: 'full',
  },
  'Sales User': {
    dashboard: 'view',
    products: 'view',
    sales: 'full',
    purchase: 'none',
    manufacturing: 'none',
    bom: 'none',
    stockLedger: 'none',
    auditLogs: 'none',
    users: 'none',
  },
  'Purchase User': {
    dashboard: 'view',
    products: 'view',
    sales: 'none',
    purchase: 'full',
    manufacturing: 'none',
    bom: 'none',
    stockLedger: 'view',
    auditLogs: 'none',
    users: 'none',
  },
  'Manufacturing User': {
    dashboard: 'view',
    products: 'view',
    sales: 'none',
    purchase: 'none',
    manufacturing: 'full',
    bom: 'full',
    stockLedger: 'view',
    auditLogs: 'view',
    users: 'none',
  },
  'Inventory Manager': {
    dashboard: 'view',
    products: 'full',
    sales: 'none',
    purchase: 'none',
    manufacturing: 'none',
    bom: 'none',
    stockLedger: 'full',
    auditLogs: 'view',
    users: 'none',
  },
  'Business Owner': {
    dashboard: 'view',
    products: 'view',
    sales: 'view',
    purchase: 'view',
    manufacturing: 'view',
    bom: 'view',
    stockLedger: 'view',
    auditLogs: 'view',
    users: 'none',
  },
};

const SEEDED_USERS: AppUser[] = [
  { id: 'USR-001', name: 'Rahul Gupta', email: 'rahul@shivfurniture.com', role: 'Admin', access: ROLE_ACCESS.Admin },
  {
    id: 'USR-002',
    name: 'Priya Sharma',
    email: 'priya@shivfurniture.com',
    role: 'Sales User',
    access: ROLE_ACCESS['Sales User'],
  },
  {
    id: 'USR-003',
    name: 'Amit Patel',
    email: 'amit@shivfurniture.com',
    role: 'Purchase User',
    access: ROLE_ACCESS['Purchase User'],
  },
  {
    id: 'USR-004',
    name: 'Sneha Joshi',
    email: 'sneha@shivfurniture.com',
    role: 'Manufacturing User',
    access: ROLE_ACCESS['Manufacturing User'],
  },
  {
    id: 'USR-005',
    name: 'Vikram Singh',
    email: 'vikram@shivfurniture.com',
    role: 'Inventory Manager',
    access: ROLE_ACCESS['Inventory Manager'],
  },
  {
    id: 'USR-006',
    name: 'Shiv Agarwal',
    email: 'shiv@shivfurniture.com',
    role: 'Business Owner',
    access: ROLE_ACCESS['Business Owner'],
  },
];

const SEEDED_PRODUCTS: Product[] = [
  {
    id: 'PRD-001',
    name: 'Wooden Table',
    salesPrice: 8500,
    costPrice: 4200,
    onHand: 15,
    reserved: 0,
    procureOnDemand: true,
    procurementType: 'Manufacturing',
  },
  {
    id: 'PRD-002',
    name: 'Office Chair',
    salesPrice: 5200,
    costPrice: 2800,
    onHand: 40,
    reserved: 0,
    procureOnDemand: true,
    procurementType: 'Manufacturing',
  },
  {
    id: 'PRD-003',
    name: 'Dining Table',
    salesPrice: 12000,
    costPrice: 6500,
    onHand: 5,
    reserved: 0,
    procureOnDemand: true,
    procurementType: 'Manufacturing',
  },
  {
    id: 'PRD-004',
    name: 'Wooden Legs',
    salesPrice: 150,
    costPrice: 80,
    onHand: 200,
    reserved: 0,
    procureOnDemand: true,
    procurementType: 'Purchase',
    preferredVendor: 'Timber Mart',
  },
  {
    id: 'PRD-005',
    name: 'Wooden Top',
    salesPrice: 800,
    costPrice: 400,
    onHand: 50,
    reserved: 0,
    procureOnDemand: true,
    procurementType: 'Purchase',
    preferredVendor: 'Shree Wood Traders',
  },
  {
    id: 'PRD-006',
    name: 'Screws (box)',
    salesPrice: 120,
    costPrice: 60,
    onHand: 500,
    reserved: 0,
    procureOnDemand: true,
    procurementType: 'Purchase',
    preferredVendor: 'FastFix Supplies',
  },
];

const SEEDED_BOMS: Bom[] = [
  {
    id: 'BOM-001',
    finishedProductId: 'PRD-001',
    components: [
      { id: 'BOMC-001', productId: 'PRD-004', qty: 4 },
      { id: 'BOMC-002', productId: 'PRD-005', qty: 1 },
      { id: 'BOMC-003', productId: 'PRD-006', qty: 12 },
    ],
    operations: [
      { id: 'BOMO-001', operationName: 'Assembly', workCenter: 'Assembly Line', durationMins: 60 },
      { id: 'BOMO-002', operationName: 'Painting', workCenter: 'Paint Floor', durationMins: 30 },
      { id: 'BOMO-003', operationName: 'Packing', workCenter: 'Packaging Unit', durationMins: 20 },
    ],
  },
];

const dateToday = () => new Date().toISOString().slice(0, 10);

const money = (v: number) => `\u20b9${Math.round(v).toLocaleString('en-IN')}`;
const qtyText = (v: number) => `${Math.round(v)} units`;

const prettyDate = (isoDate: string) =>
  new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const timeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Good morning';
  }
  if (hour < 18) {
    return 'Good afternoon';
  }
  return 'Good evening';
};

const classes = {
  glass: 'bg-white/90 backdrop-blur border border-slate-200 rounded-2xl shadow-sm',
  card: 'bg-white border border-slate-200 rounded-2xl shadow-sm',
  btnPrimary:
    'inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm shadow-indigo-600/20 transition-all duration-200 hover:scale-[1.02] hover:bg-indigo-700',
  btnSecondary:
    'inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:scale-[1.02] hover:bg-slate-200 border border-slate-200',
  btnDanger:
    'inline-flex items-center gap-2 rounded-lg bg-rose-500 px-3 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:bg-rose-600',
  input:
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500',
};

const statusBadge = (kind: string) => {
  if (kind.includes('Delivered') || kind.includes('Completed') || kind.includes('Fully Received')) {
    return 'rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200';
  }
  if (kind.includes('Cancelled')) {
    return 'rounded-full px-2.5 py-0.5 text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200';
  }
  if (kind.includes('Partial') || kind.includes('Partially') || kind.includes('In Progress')) {
    return 'rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200';
  }
  if (kind.includes('Confirmed')) {
    return 'rounded-full px-2.5 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200';
  }
  if (kind.includes('Draft') || kind.includes('Pending')) {
    return 'rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200';
  }
  return 'rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200';
};

function MiniErpApp() {
  const idCounters = useRef({ SO: 3, PO: 3, MO: 3, BOM: 2, LOG: 4, LED: 3, USER: 7, PRD: 7 });

  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [activeView, setActiveView] = useState<ViewKey>('dashboard');

  const [users, setUsers] = useState<AppUser[]>(SEEDED_USERS);
  const [products, setProducts] = useState<Product[]>(SEEDED_PRODUCTS);
  const [boms, setBoms] = useState<Bom[]>(SEEDED_BOMS);

  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([
    {
      id: 'SO-001',
      customerName: 'Nexa Spaces',
      customerAddress: 'Bandra West, Mumbai',
      mobileNumber: '9876543210',
      salesPerson: 'Rahul Gupta',
      orderDate: dateToday(),
      lines: [{ id: 'SOL-001', productId: 'PRD-001', orderedQty: 3, unitPrice: 8500, deliveredQty: 1 }],
      notes: 'Urgent interior project',
      total: 25500,
      status: 'Partially Delivered',
    },
    {
      id: 'SO-002',
      customerName: 'Urban Desk Co.',
      customerAddress: 'Andheri East, Mumbai',
      mobileNumber: '9898989898',
      salesPerson: 'Priya Sharma',
      orderDate: dateToday(),
      lines: [{ id: 'SOL-002', productId: 'PRD-002', orderedQty: 5, unitPrice: 5200, deliveredQty: 0 }],
      notes: '',
      total: 26000,
      status: 'Confirmed',
    },
  ]);

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: 'PO-001',
      vendorName: 'Timber Mart',
      vendorAddress: 'Navi Mumbai',
      responsiblePerson: 'Amit Patel',
      orderDate: dateToday(),
      expectedDeliveryDate: dateToday(),
      lines: [{ id: 'POL-001', productId: 'PRD-004', qty: 80, unitCost: 80, receivedQty: 40 }],
      totalCost: 6400,
      status: 'Partially Received',
      source: 'Manual',
    },
    {
      id: 'PO-002',
      vendorName: 'FastFix Supplies',
      vendorAddress: 'Thane',
      responsiblePerson: 'Amit Patel',
      orderDate: dateToday(),
      expectedDeliveryDate: dateToday(),
      lines: [{ id: 'POL-002', productId: 'PRD-006', qty: 100, unitCost: 60, receivedQty: 0 }],
      totalCost: 6000,
      status: 'Confirmed',
      source: 'Auto-Triggered',
    },
  ]);

  const [manufacturingOrders, setManufacturingOrders] = useState<ManufacturingOrder[]>([
    {
      id: 'MO-001',
      productId: 'PRD-001',
      qty: 10,
      assignee: 'Sneha Joshi',
      status: 'In Progress',
      source: 'Manual',
      scheduledDate: dateToday(),
      bomId: 'BOM-001',
      workOrders: [
        { id: 'WO-001', operationName: 'Assembly', workCenter: 'Assembly Line', durationMins: 60, status: 'Done' },
        { id: 'WO-002', operationName: 'Painting', workCenter: 'Paint Floor', durationMins: 30, status: 'In Progress' },
        { id: 'WO-003', operationName: 'Packing', workCenter: 'Packaging Unit', durationMins: 20, status: 'Pending' },
      ],
    },
    {
      id: 'MO-002',
      productId: 'PRD-003',
      qty: 4,
      assignee: 'Sneha Joshi',
      status: 'Draft',
      source: 'Auto-Triggered',
      scheduledDate: dateToday(),
      bomId: 'BOM-001',
      workOrders: [
        { id: 'WO-004', operationName: 'Assembly', workCenter: 'Assembly Line', durationMins: 60, status: 'Pending' },
      ],
    },
  ]);

  const [stockLedger, setStockLedger] = useState<StockLedgerEntry[]>([
    {
      id: 'LED-001',
      date: new Date().toISOString(),
      productId: 'PRD-001',
      movementType: 'Sale Delivery',
      qtyChange: -1,
      resultingBalance: 14,
      reference: 'SO-001',
      user: 'Rahul Gupta',
    },
    {
      id: 'LED-002',
      date: new Date().toISOString(),
      productId: 'PRD-004',
      movementType: 'Purchase Receipt',
      qtyChange: 40,
      resultingBalance: 200,
      reference: 'PO-001',
      user: 'Amit Patel',
    },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'LOG-001',
      timestamp: new Date().toISOString(),
      user: 'Rahul Gupta',
      role: 'Admin',
      module: 'Sales',
      action: 'Delivered',
      recordId: 'SO-001',
      oldValue: { status: 'Confirmed' },
      newValue: { status: 'Partially Delivered' },
    },
    {
      id: 'LOG-002',
      timestamp: new Date().toISOString(),
      user: 'Amit Patel',
      role: 'Purchase User',
      module: 'Purchase',
      action: 'Updated',
      recordId: 'PO-001',
      oldValue: { status: 'Confirmed' },
      newValue: { status: 'Partially Received' },
    },
    {
      id: 'LOG-003',
      timestamp: new Date().toISOString(),
      user: 'Sneha Joshi',
      role: 'Manufacturing User',
      module: 'Manufacturing',
      action: 'Updated',
      recordId: 'MO-001',
      oldValue: { status: 'Draft' },
      newValue: { status: 'In Progress' },
    },
  ]);

  const [toasts, setToasts] = useState<Toast[]>([]);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [groups, setGroups] = useState<Record<string, boolean>>({
    MAIN: true,
    OPERATIONS: true,
    INVENTORY: true,
    SETTINGS: true,
  });

  const [productSearch, setProductSearch] = useState('');
  const [productProcFilter, setProductProcFilter] = useState<'All' | 'Purchase' | 'Manufacturing'>('All');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const [salesFilter, setSalesFilter] = useState<'All' | 'Draft' | 'Confirmed' | 'Delivered' | 'Cancelled'>('All');
  const [salesSearch, setSalesSearch] = useState('');

  const [poSearch, setPoSearch] = useState('');
  const [moSearch, setMoSearch] = useState('');

  const [ledgerProductFilter, setLedgerProductFilter] = useState('All');
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState<'All' | MovementType>('All');
  const [ledgerFrom, setLedgerFrom] = useState('');
  const [ledgerTo, setLedgerTo] = useState('');

  const [auditSearch, setAuditSearch] = useState('');
  const [auditModuleFilter, setAuditModuleFilter] = useState('All');
  const [auditActionFilter, setAuditActionFilter] = useState('All');
  const [expandedAudit, setExpandedAudit] = useState<string | null>(null);

  const [loginEmail, setLoginEmail] = useState(SEEDED_USERS[0].email);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState<UserRole>('Admin');

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({ open: false, title: '', message: '' });

  const [productModal, setProductModal] = useState<{
    open: boolean;
    editingId: string | null;
    form: {
      name: string;
      salesPrice: number;
      costPrice: number;
      onHand: number;
      procureOnDemand: boolean;
      procurementType: 'Purchase' | 'Manufacturing';
      preferredVendor: string;
      bomReference: string;
    };
  }>({
    open: false,
    editingId: null,
    form: {
      name: '',
      salesPrice: 0,
      costPrice: 0,
      onHand: 0,
      procureOnDemand: true,
      procurementType: 'Purchase',
      preferredVendor: '',
      bomReference: '',
    },
  });

  const [salesModal, setSalesModal] = useState<{
    open: boolean;
    editingId: string | null;
    form: {
      customerName: string;
      customerAddress: string;
      mobileNumber: string;
      orderDate: string;
      notes: string;
      lines: SalesOrderLine[];
    };
  }>({
    open: false,
    editingId: null,
    form: {
      customerName: '',
      customerAddress: '',
      mobileNumber: '',
      orderDate: dateToday(),
      notes: '',
      lines: [{ id: 'SOL-F-001', productId: SEEDED_PRODUCTS[0].id, orderedQty: 1, unitPrice: SEEDED_PRODUCTS[0].salesPrice, deliveredQty: 0 }],
    },
  });

  const [deliverModal, setDeliverModal] = useState<{ open: boolean; orderId: string; rows: Record<string, number> }>({
    open: false,
    orderId: '',
    rows: {},
  });

  const [purchaseModal, setPurchaseModal] = useState<{
    open: boolean;
    editingId: string | null;
    form: {
      vendorName: string;
      vendorAddress: string;
      responsiblePerson: string;
      orderDate: string;
      expectedDeliveryDate: string;
      lines: PurchaseOrderLine[];
      source: 'Manual' | 'Auto-Triggered';
    };
  }>({
    open: false,
    editingId: null,
    form: {
      vendorName: '',
      vendorAddress: '',
      responsiblePerson: '',
      orderDate: dateToday(),
      expectedDeliveryDate: dateToday(),
      lines: [{ id: 'POL-F-001', productId: SEEDED_PRODUCTS[0].id, qty: 1, unitCost: SEEDED_PRODUCTS[0].costPrice, receivedQty: 0 }],
      source: 'Manual',
    },
  });

  const [receiveModal, setReceiveModal] = useState<{ open: boolean; orderId: string; rows: Record<string, number> }>({
    open: false,
    orderId: '',
    rows: {},
  });

  const [bomModal, setBomModal] = useState<{
    open: boolean;
    editingId: string | null;
    form: {
      finishedProductId: string;
      components: BomComponent[];
      operations: BomOperation[];
    };
  }>({
    open: false,
    editingId: null,
    form: {
      finishedProductId: SEEDED_PRODUCTS[0].id,
      components: [{ id: 'BOMCF-001', productId: SEEDED_PRODUCTS[3].id, qty: 1 }],
      operations: [{ id: 'BOMOF-001', operationName: 'Assembly', workCenter: 'Assembly Line', durationMins: 30 }],
    },
  });

  const [moModal, setMoModal] = useState<{
    open: boolean;
    form: {
      productId: string;
      qty: number;
      bomId: string;
      assignee: string;
      scheduledDate: string;
      source: 'Manual' | 'Auto-Triggered';
    };
  }>({
    open: false,
    form: {
      productId: SEEDED_PRODUCTS[0].id,
      qty: 1,
      bomId: 'BOM-001',
      assignee: 'Sneha Joshi',
      scheduledDate: dateToday(),
      source: 'Manual',
    },
  });

  const [selectedMoId, setSelectedMoId] = useState<string | null>(null);

  const [userModal, setUserModal] = useState<{
    open: boolean;
    editingId: string | null;
    form: {
      name: string;
      email: string;
      role: UserRole;
      access: ModuleAccess;
    };
  }>({
    open: false,
    editingId: null,
    form: {
      name: '',
      email: '',
      role: 'Sales User',
      access: ROLE_ACCESS['Sales User'],
    },
  });

  const [selectedSalesDetailId, setSelectedSalesDetailId] = useState<string | null>(null);

  const nextId = (prefix: keyof typeof idCounters.current) => {
    const n = idCounters.current[prefix];
    idCounters.current[prefix] += 1;
    return `${prefix}-${String(n).padStart(3, '0')}`;
  };

  const getProduct = (id: string) => products.find((p) => p.id === id);
  const getFree = (p: Product) => p.onHand - p.reserved;

  const pushToast = (kind: Toast['kind'], title: string, message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, kind, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const pushAudit = (params: {
    module: string;
    action: AuditAction;
    recordId: string;
    oldValue?: unknown;
    newValue?: unknown;
  }) => {
    if (!currentUser) {
      return;
    }
    setAuditLogs((prev) => [
      {
        id: nextId('LOG'),
        timestamp: new Date().toISOString(),
        user: currentUser.name,
        role: currentUser.role,
        module: params.module,
        action: params.action,
        recordId: params.recordId,
        oldValue: params.oldValue,
        newValue: params.newValue,
      },
      ...prev,
    ]);
  };

  const pushLedger = (entry: Omit<StockLedgerEntry, 'id' | 'date' | 'user'>) => {
    setStockLedger((prev) => [
      {
        ...entry,
        id: nextId('LED'),
        date: new Date().toISOString(),
        user: currentUser?.name ?? 'System',
      },
      ...prev,
    ]);
  };

  const navGroups = useMemo(
    () => [
      {
        key: 'MAIN',
        items: [{ key: 'dashboard' as ViewKey, label: 'Dashboard', icon: Grid3X3 }],
      },
      {
        key: 'OPERATIONS',
        items: [
          { key: 'products' as ViewKey, label: 'Products', icon: Package },
          { key: 'sales' as ViewKey, label: 'Sales Orders', icon: ShoppingCart },
          { key: 'purchase' as ViewKey, label: 'Purchase Orders', icon: Truck },
          { key: 'manufacturing' as ViewKey, label: 'Manufacturing', icon: Factory },
          { key: 'bom' as ViewKey, label: 'Bill of Materials', icon: Layers },
        ],
      },
      {
        key: 'INVENTORY',
        items: [
          { key: 'stockLedger' as ViewKey, label: 'Stock Ledger', icon: Boxes },
          { key: 'auditLogs' as ViewKey, label: 'Audit Logs', icon: ScrollText },
        ],
      },
      {
        key: 'SETTINGS',
        items: [{ key: 'users' as ViewKey, label: 'User Management', icon: Users }],
      },
    ],
    []
  );

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (productSearch && !p.name.toLowerCase().includes(productSearch.toLowerCase())) {
        return false;
      }
      if (productProcFilter !== 'All' && p.procurementType !== productProcFilter) {
        return false;
      }
      return true;
    });
  }, [products, productSearch, productProcFilter]);

  const filteredSales = useMemo(() => {
    return salesOrders.filter((so) => {
      if (salesSearch) {
        const q = salesSearch.toLowerCase();
        if (!so.id.toLowerCase().includes(q) && !so.customerName.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (salesFilter === 'Delivered' && !['Partially Delivered', 'Fully Delivered'].includes(so.status)) {
        return false;
      }
      if (salesFilter !== 'All' && salesFilter !== 'Delivered' && so.status !== salesFilter) {
        return false;
      }
      return true;
    });
  }, [salesOrders, salesFilter, salesSearch]);

  const filteredPurchase = useMemo(() => {
    return purchaseOrders.filter((po) => {
      if (!poSearch) {
        return true;
      }
      const q = poSearch.toLowerCase();
      return po.id.toLowerCase().includes(q) || po.vendorName.toLowerCase().includes(q);
    });
  }, [purchaseOrders, poSearch]);

  const filteredMO = useMemo(() => {
    return manufacturingOrders.filter((mo) => {
      if (!moSearch) {
        return true;
      }
      const q = moSearch.toLowerCase();
      return mo.id.toLowerCase().includes(q) || (getProduct(mo.productId)?.name.toLowerCase() ?? '').includes(q);
    });
  }, [manufacturingOrders, moSearch, products]);

  const filteredLedger = useMemo(() => {
    return stockLedger.filter((row) => {
      if (ledgerProductFilter !== 'All' && row.productId !== ledgerProductFilter) {
        return false;
      }
      if (ledgerTypeFilter !== 'All' && row.movementType !== ledgerTypeFilter) {
        return false;
      }
      const d = row.date.slice(0, 10);
      if (ledgerFrom && d < ledgerFrom) {
        return false;
      }
      if (ledgerTo && d > ledgerTo) {
        return false;
      }
      return true;
    });
  }, [stockLedger, ledgerProductFilter, ledgerTypeFilter, ledgerFrom, ledgerTo]);

  const filteredAudit = useMemo(() => {
    return auditLogs.filter((log) => {
      if (auditSearch) {
        const q = auditSearch.toLowerCase();
        if (!(`${log.user} ${log.module} ${log.recordId}`.toLowerCase().includes(q))) {
          return false;
        }
      }
      if (auditModuleFilter !== 'All' && log.module !== auditModuleFilter) {
        return false;
      }
      if (auditActionFilter !== 'All' && log.action !== auditActionFilter) {
        return false;
      }
      return true;
    });
  }, [auditLogs, auditSearch, auditModuleFilter, auditActionFilter]);

  const selectedProduct = selectedProductId ? getProduct(selectedProductId) : null;
  const selectedMO = selectedMoId ? manufacturingOrders.find((m) => m.id === selectedMoId) ?? null : null;
  const selectedSalesDetail = selectedSalesDetailId
    ? salesOrders.find((s) => s.id === selectedSalesDetailId) ?? null
    : null;

  const ensureAuthorized = (view: ViewKey) => {
    if (!currentUser) {
      return false;
    }
    return currentUser.access[view] !== 'none';
  };

  const openProductModal = (editing?: Product) => {
    if (editing) {
      setProductModal({
        open: true,
        editingId: editing.id,
        form: {
          name: editing.name,
          salesPrice: editing.salesPrice,
          costPrice: editing.costPrice,
          onHand: editing.onHand,
          procureOnDemand: editing.procureOnDemand,
          procurementType: editing.procurementType,
          preferredVendor: editing.preferredVendor ?? '',
          bomReference: editing.bomReference ?? '',
        },
      });
      return;
    }

    setProductModal({
      open: true,
      editingId: null,
      form: {
        name: '',
        salesPrice: 0,
        costPrice: 0,
        onHand: 0,
        procureOnDemand: true,
        procurementType: 'Purchase',
        preferredVendor: '',
        bomReference: '',
      },
    });
  };

  const saveProduct = () => {
    const f = productModal.form;
    if (!f.name.trim()) {
      pushToast('error', 'Validation', 'Product name is required.');
      return;
    }

    if (productModal.editingId) {
      const oldProduct = products.find((p) => p.id === productModal.editingId);
      if (!oldProduct) {
        return;
      }
      const updated: Product = {
        ...oldProduct,
        name: f.name,
        salesPrice: Number(f.salesPrice),
        costPrice: Number(f.costPrice),
        onHand: Number(f.onHand),
        procureOnDemand: f.procureOnDemand,
        procurementType: f.procurementType,
        preferredVendor: f.procurementType === 'Purchase' ? f.preferredVendor : undefined,
        bomReference: f.procurementType === 'Manufacturing' ? f.bomReference : undefined,
      };
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      pushAudit({ module: 'Products', action: 'Updated', recordId: updated.id, oldValue: oldProduct, newValue: updated });
      pushToast('success', 'Product updated', `${updated.name} has been updated.`);
    } else {
      const created: Product = {
        id: nextId('PRD'),
        name: f.name,
        salesPrice: Number(f.salesPrice),
        costPrice: Number(f.costPrice),
        onHand: Number(f.onHand),
        reserved: 0,
        procureOnDemand: f.procureOnDemand,
        procurementType: f.procurementType,
        preferredVendor: f.procurementType === 'Purchase' ? f.preferredVendor : undefined,
        bomReference: f.procurementType === 'Manufacturing' ? f.bomReference : undefined,
      };
      setProducts((prev) => [created, ...prev]);
      pushAudit({ module: 'Products', action: 'Created', recordId: created.id, newValue: created });
      pushToast('success', 'Product created', `${created.name} has been created.`);
    }
    setProductModal((prev) => ({ ...prev, open: false }));
  };

  const deleteProduct = (productId: string) => {
    const p = products.find((x) => x.id === productId);
    if (!p) {
      return;
    }
    setConfirmDialog({
      open: true,
      title: 'Delete product?',
      message: `This will permanently remove ${p.name}.`,
      onConfirm: () => {
        setProducts((prev) => prev.filter((x) => x.id !== productId));
        pushAudit({ module: 'Products', action: 'Deleted', recordId: productId, oldValue: p });
        pushToast('warning', 'Product deleted', `${p.name} has been deleted.`);
      },
    });
  };

  const openSalesModal = (editing?: SalesOrder) => {
    if (editing) {
      setSalesModal({
        open: true,
        editingId: editing.id,
        form: {
          customerName: editing.customerName,
          customerAddress: editing.customerAddress,
          mobileNumber: editing.mobileNumber,
          orderDate: editing.orderDate,
          notes: editing.notes,
          lines: editing.lines.map((l) => ({ ...l })),
        },
      });
      return;
    }
    const defaultProduct = products[0];
    setSalesModal({
      open: true,
      editingId: null,
      form: {
        customerName: '',
        customerAddress: '',
        mobileNumber: '',
        orderDate: dateToday(),
        notes: '',
        lines: [
          {
            id: `SOL-F-${Date.now()}`,
            productId: defaultProduct?.id ?? '',
            orderedQty: 1,
            unitPrice: defaultProduct?.salesPrice ?? 0,
            deliveredQty: 0,
          },
        ],
      },
    });
  };

  const salesFormTotal = salesModal.form.lines.reduce((sum, l) => sum + l.orderedQty * l.unitPrice, 0);

  const saveSales = () => {
    const f = salesModal.form;
    if (!f.customerName.trim() || f.lines.length === 0) {
      pushToast('error', 'Validation', 'Customer name and at least one line are required.');
      return;
    }
    if (!currentUser) {
      return;
    }

    const cleanLines = f.lines.map((line) => ({
      ...line,
      unitPrice: Number(line.unitPrice),
      orderedQty: Number(line.orderedQty),
      deliveredQty: Number(line.deliveredQty),
    }));
    const total = cleanLines.reduce((sum, line) => sum + line.orderedQty * line.unitPrice, 0);

    if (salesModal.editingId) {
      const old = salesOrders.find((x) => x.id === salesModal.editingId);
      if (!old) {
        return;
      }
      const updated: SalesOrder = {
        ...old,
        customerName: f.customerName,
        customerAddress: f.customerAddress,
        mobileNumber: f.mobileNumber,
        orderDate: f.orderDate,
        notes: f.notes,
        lines: cleanLines,
        total,
      };
      setSalesOrders((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      pushAudit({ module: 'Sales', action: 'Updated', recordId: updated.id, oldValue: old, newValue: updated });
      pushToast('success', 'Sales order updated', `${updated.id} updated.`);
    } else {
      const created: SalesOrder = {
        id: nextId('SO'),
        customerName: f.customerName,
        customerAddress: f.customerAddress,
        mobileNumber: f.mobileNumber,
        orderDate: f.orderDate,
        notes: f.notes,
        salesPerson: currentUser.name,
        lines: cleanLines,
        total,
        status: 'Draft',
      };
      setSalesOrders((prev) => [created, ...prev]);
      pushAudit({ module: 'Sales', action: 'Created', recordId: created.id, newValue: created });
      pushToast('success', 'Sales order created', `${created.id} created successfully.`);
    }

    setSalesModal((prev) => ({ ...prev, open: false }));
  };

  const confirmSalesOrder = (soId: string) => {
    const so = salesOrders.find((x) => x.id === soId);
    if (!so || so.status === 'Cancelled') {
      return;
    }

    const nextProducts = products.map((p) => ({ ...p }));
    const newPOs: PurchaseOrder[] = [];
    const newMOs: ManufacturingOrder[] = [];

    for (const line of so.lines) {
      const p = nextProducts.find((item) => item.id === line.productId);
      if (!p) {
        continue;
      }
      const free = p.onHand - p.reserved;
      if (free >= line.orderedQty) {
        p.reserved += line.orderedQty;
      } else {
        if (free > 0) {
          p.reserved += free;
        }
        const shortage = line.orderedQty - Math.max(0, free);
        if (shortage > 0 && p.procureOnDemand) {
          if (p.procurementType === 'Purchase') {
            const po: PurchaseOrder = {
              id: nextId('PO'),
              vendorName: p.preferredVendor ?? 'Default Vendor',
              vendorAddress: '-',
              responsiblePerson: currentUser?.name ?? 'System',
              orderDate: dateToday(),
              expectedDeliveryDate: dateToday(),
              lines: [
                {
                  id: `POL-${Date.now()}-${line.id}`,
                  productId: p.id,
                  qty: shortage,
                  unitCost: p.costPrice,
                  receivedQty: 0,
                },
              ],
              totalCost: shortage * p.costPrice,
              status: 'Confirmed',
              source: 'Auto-Triggered',
            };
            newPOs.push(po);
            pushToast('info', 'Procurement triggered', `Purchase order ${po.id} generated for ${p.name}.`);
            pushAudit({ module: 'Purchase', action: 'Created', recordId: po.id, newValue: po });
          } else {
            const linkedBom = boms.find((b) => b.finishedProductId === p.id) ?? boms[0];
            if (!linkedBom) {
              pushToast('warning', 'No BoM found', `Cannot auto-create MO for ${p.name}.`);
            } else {
              const mo: ManufacturingOrder = {
                id: nextId('MO'),
                productId: p.id,
                qty: shortage,
                assignee: currentUser?.name ?? 'Planner',
                status: 'Draft',
                source: 'Auto-Triggered',
                scheduledDate: dateToday(),
                bomId: linkedBom.id,
                workOrders: linkedBom.operations.map((op, idx) => ({
                  id: `WO-${Date.now()}-${idx}`,
                  operationName: op.operationName,
                  workCenter: op.workCenter,
                  durationMins: op.durationMins,
                  status: 'Pending',
                })),
              };
              newMOs.push(mo);
              pushToast('info', 'Procurement triggered', `Manufacturing order ${mo.id} generated for ${p.name}.`);
              pushAudit({ module: 'Manufacturing', action: 'Created', recordId: mo.id, newValue: mo });
            }
          }
        }
      }
    }

    setProducts(nextProducts);
    if (newPOs.length > 0) {
      setPurchaseOrders((prev) => [...newPOs, ...prev]);
    }
    if (newMOs.length > 0) {
      setManufacturingOrders((prev) => [...newMOs, ...prev]);
    }

    setSalesOrders((prev) =>
      prev.map((x) => (x.id === soId ? { ...x, status: 'Confirmed' as SalesStatus } : x))
    );
    pushAudit({ module: 'Sales', action: 'Confirmed', recordId: so.id, oldValue: { status: so.status }, newValue: { status: 'Confirmed' } });
    pushToast('success', 'Sales confirmed', `${so.id} has been confirmed.`);
  };

  const openDeliverModal = (so: SalesOrder) => {
    const rows: Record<string, number> = {};
    so.lines.forEach((line) => {
      rows[line.id] = Math.max(0, line.orderedQty - line.deliveredQty);
    });
    setDeliverModal({ open: true, orderId: so.id, rows });
  };

  const deliverSalesOrder = () => {
    const so = salesOrders.find((x) => x.id === deliverModal.orderId);
    if (!so) {
      return;
    }

    const nextProducts = products.map((p) => ({ ...p }));
    const nextSO: SalesOrder = {
      ...so,
      lines: so.lines.map((line) => {
        const deliverQty = Math.min(
          Math.max(0, Number(deliverModal.rows[line.id] ?? 0)),
          line.orderedQty - line.deliveredQty
        );
        if (deliverQty <= 0) {
          return line;
        }
        const p = nextProducts.find((x) => x.id === line.productId);
        if (p) {
          p.onHand = Math.max(0, p.onHand - deliverQty);
          p.reserved = Math.max(0, p.reserved - deliverQty);
          pushLedger({
            productId: p.id,
            movementType: 'Sale Delivery',
            qtyChange: -deliverQty,
            resultingBalance: p.onHand,
            reference: so.id,
          });
        }
        return { ...line, deliveredQty: line.deliveredQty + deliverQty };
      }),
    };

    const allDelivered = nextSO.lines.every((line) => line.deliveredQty >= line.orderedQty);
    nextSO.status = allDelivered ? 'Fully Delivered' : 'Partially Delivered';

    setProducts(nextProducts);
    setSalesOrders((prev) => prev.map((x) => (x.id === so.id ? nextSO : x)));
    pushAudit({ module: 'Sales', action: 'Delivered', recordId: so.id, oldValue: so, newValue: nextSO });
    pushToast('success', 'Delivery recorded', `${so.id} updated as ${nextSO.status}.`);
    setDeliverModal({ open: false, orderId: '', rows: {} });
  };

  const openPurchaseModal = (editing?: PurchaseOrder) => {
    if (editing) {
      setPurchaseModal({
        open: true,
        editingId: editing.id,
        form: {
          vendorName: editing.vendorName,
          vendorAddress: editing.vendorAddress,
          responsiblePerson: editing.responsiblePerson,
          orderDate: editing.orderDate,
          expectedDeliveryDate: editing.expectedDeliveryDate,
          lines: editing.lines.map((line) => ({ ...line })),
          source: editing.source,
        },
      });
      return;
    }

    setPurchaseModal({
      open: true,
      editingId: null,
      form: {
        vendorName: '',
        vendorAddress: '',
        responsiblePerson: currentUser?.name ?? '',
        orderDate: dateToday(),
        expectedDeliveryDate: dateToday(),
        lines: [{ id: `POL-F-${Date.now()}`, productId: products[0]?.id ?? '', qty: 1, unitCost: products[0]?.costPrice ?? 0, receivedQty: 0 }],
        source: 'Manual',
      },
    });
  };

  const purchaseTotal = purchaseModal.form.lines.reduce((sum, line) => sum + line.qty * line.unitCost, 0);

  const savePurchase = () => {
    const f = purchaseModal.form;
    if (!f.vendorName.trim() || f.lines.length === 0) {
      pushToast('error', 'Validation', 'Vendor and line items are required.');
      return;
    }
    const lines = f.lines.map((line) => ({ ...line, qty: Number(line.qty), unitCost: Number(line.unitCost) }));
    const totalCost = lines.reduce((sum, line) => sum + line.qty * line.unitCost, 0);

    if (purchaseModal.editingId) {
      const old = purchaseOrders.find((x) => x.id === purchaseModal.editingId);
      if (!old) {
        return;
      }
      const updated: PurchaseOrder = {
        ...old,
        vendorName: f.vendorName,
        vendorAddress: f.vendorAddress,
        responsiblePerson: f.responsiblePerson,
        orderDate: f.orderDate,
        expectedDeliveryDate: f.expectedDeliveryDate,
        lines,
        source: f.source,
        totalCost,
      };
      setPurchaseOrders((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      pushAudit({ module: 'Purchase', action: 'Updated', recordId: updated.id, oldValue: old, newValue: updated });
      pushToast('success', 'Purchase order updated', `${updated.id} updated.`);
    } else {
      const created: PurchaseOrder = {
        id: nextId('PO'),
        vendorName: f.vendorName,
        vendorAddress: f.vendorAddress,
        responsiblePerson: f.responsiblePerson,
        orderDate: f.orderDate,
        expectedDeliveryDate: f.expectedDeliveryDate,
        lines,
        totalCost,
        status: 'Draft',
        source: f.source,
      };
      setPurchaseOrders((prev) => [created, ...prev]);
      pushAudit({ module: 'Purchase', action: 'Created', recordId: created.id, newValue: created });
      pushToast('success', 'Purchase order created', `${created.id} created.`);
    }

    setPurchaseModal((prev) => ({ ...prev, open: false }));
  };

  const openReceiveModal = (po: PurchaseOrder) => {
    const rows: Record<string, number> = {};
    po.lines.forEach((line) => {
      rows[line.id] = Math.max(0, line.qty - line.receivedQty);
    });
    setReceiveModal({ open: true, orderId: po.id, rows });
  };

  const receivePurchase = () => {
    const po = purchaseOrders.find((x) => x.id === receiveModal.orderId);
    if (!po) {
      return;
    }

    const nextProducts = products.map((p) => ({ ...p }));
    const nextPO: PurchaseOrder = {
      ...po,
      lines: po.lines.map((line) => {
        const receiveQty = Math.min(Math.max(0, Number(receiveModal.rows[line.id] ?? 0)), line.qty - line.receivedQty);
        if (receiveQty <= 0) {
          return line;
        }
        const p = nextProducts.find((x) => x.id === line.productId);
        if (p) {
          p.onHand += receiveQty;
          pushLedger({
            productId: p.id,
            movementType: 'Purchase Receipt',
            qtyChange: receiveQty,
            resultingBalance: p.onHand,
            reference: po.id,
          });
        }
        return { ...line, receivedQty: line.receivedQty + receiveQty };
      }),
    };

    const allReceived = nextPO.lines.every((line) => line.receivedQty >= line.qty);
    nextPO.status = allReceived ? 'Fully Received' : 'Partially Received';

    setProducts(nextProducts);
    setPurchaseOrders((prev) => prev.map((x) => (x.id === po.id ? nextPO : x)));
    pushAudit({ module: 'Purchase', action: 'Updated', recordId: po.id, oldValue: po, newValue: nextPO });
    pushToast('success', 'Receipt posted', `${po.id} updated to ${nextPO.status}.`);
    setReceiveModal({ open: false, orderId: '', rows: {} });
  };

  const openBomModal = (editing?: Bom) => {
    if (editing) {
      setBomModal({
        open: true,
        editingId: editing.id,
        form: {
          finishedProductId: editing.finishedProductId,
          components: editing.components.map((c) => ({ ...c })),
          operations: editing.operations.map((o) => ({ ...o })),
        },
      });
      return;
    }

    setBomModal({
      open: true,
      editingId: null,
      form: {
        finishedProductId: products[0]?.id ?? '',
        components: [{ id: `BOMCF-${Date.now()}`, productId: products[0]?.id ?? '', qty: 1 }],
        operations: [{ id: `BOMOF-${Date.now()}`, operationName: 'Assembly', workCenter: 'Assembly Line', durationMins: 30 }],
      },
    });
  };

  const saveBom = () => {
    const f = bomModal.form;
    if (!f.finishedProductId || f.components.length === 0) {
      pushToast('error', 'Validation', 'Finished product and components are required.');
      return;
    }

    if (bomModal.editingId) {
      const old = boms.find((x) => x.id === bomModal.editingId);
      if (!old) {
        return;
      }
      const updated: Bom = {
        ...old,
        finishedProductId: f.finishedProductId,
        components: f.components,
        operations: f.operations,
      };
      setBoms((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      pushAudit({ module: 'BoM', action: 'Updated', recordId: updated.id, oldValue: old, newValue: updated });
      pushToast('success', 'BoM updated', `${updated.id} saved.`);
    } else {
      const created: Bom = {
        id: nextId('BOM'),
        finishedProductId: f.finishedProductId,
        components: f.components,
        operations: f.operations,
      };
      setBoms((prev) => [created, ...prev]);
      pushAudit({ module: 'BoM', action: 'Created', recordId: created.id, newValue: created });
      pushToast('success', 'BoM created', `${created.id} created.`);
    }

    setBomModal((prev) => ({ ...prev, open: false }));
  };

  const saveMO = () => {
    const f = moModal.form;
    if (!f.productId || !f.bomId || f.qty <= 0) {
      pushToast('error', 'Validation', 'Product, BoM, and quantity are required.');
      return;
    }
    const bom = boms.find((x) => x.id === f.bomId);
    if (!bom) {
      pushToast('error', 'Validation', 'Invalid BoM selected.');
      return;
    }

    const created: ManufacturingOrder = {
      id: nextId('MO'),
      productId: f.productId,
      qty: f.qty,
      assignee: f.assignee,
      status: 'Draft',
      source: f.source,
      scheduledDate: f.scheduledDate,
      bomId: f.bomId,
      workOrders: bom.operations.map((op, idx) => ({
        id: `WO-${Date.now()}-${idx}`,
        operationName: op.operationName,
        workCenter: op.workCenter,
        durationMins: op.durationMins,
        status: 'Pending',
      })),
    };

    setManufacturingOrders((prev) => [created, ...prev]);
    pushAudit({ module: 'Manufacturing', action: 'Created', recordId: created.id, newValue: created });
    pushToast('success', 'Manufacturing order created', `${created.id} created.`);
    setMoModal((prev) => ({ ...prev, open: false }));
  };

  const startProduction = (moId: string) => {
    const mo = manufacturingOrders.find((x) => x.id === moId);
    if (!mo || mo.status !== 'Draft') {
      return;
    }
    const bom = boms.find((x) => x.id === mo.bomId);
    if (!bom) {
      return;
    }

    const nextProducts = products.map((p) => ({ ...p }));
    bom.components.forEach((component) => {
      const p = nextProducts.find((x) => x.id === component.productId);
      if (p) {
        p.reserved += component.qty * mo.qty;
      }
    });

    setProducts(nextProducts);
    setManufacturingOrders((prev) =>
      prev.map((x) => (x.id === moId ? { ...x, status: 'In Progress' as ManufacturingStatus } : x))
    );
    pushAudit({ module: 'Manufacturing', action: 'Updated', recordId: mo.id, oldValue: mo, newValue: { ...mo, status: 'In Progress' } });
    pushToast('info', 'Production started', `${mo.id} is now in progress.`);
  };

  const markWorkOrderDone = (moId: string, workOrderId: string) => {
    setManufacturingOrders((prev) =>
      prev.map((mo) => {
        if (mo.id !== moId) {
          return mo;
        }
        return {
          ...mo,
          workOrders: mo.workOrders.map((wo) =>
            wo.id === workOrderId ? { ...wo, status: 'Done' as WorkOrder['status'] } : wo
          ),
        };
      })
    );
  };

  const completeProduction = (moId: string) => {
    const mo = manufacturingOrders.find((x) => x.id === moId);
    if (!mo || mo.status === 'Completed') {
      return;
    }
    if (!mo.workOrders.every((wo) => wo.status === 'Done')) {
      pushToast('warning', 'Work orders pending', 'Complete all work orders first.');
      return;
    }

    const bom = boms.find((x) => x.id === mo.bomId);
    if (!bom) {
      return;
    }

    const nextProducts = products.map((p) => ({ ...p }));

    bom.components.forEach((component) => {
      const p = nextProducts.find((x) => x.id === component.productId);
      if (p) {
        const consume = component.qty * mo.qty;
        p.onHand = Math.max(0, p.onHand - consume);
        p.reserved = Math.max(0, p.reserved - consume);
        pushLedger({
          productId: p.id,
          movementType: 'Manufacturing Consumption',
          qtyChange: -consume,
          resultingBalance: p.onHand,
          reference: mo.id,
        });
      }
    });

    const finished = nextProducts.find((x) => x.id === mo.productId);
    if (finished) {
      finished.onHand += mo.qty;
      pushLedger({
        productId: finished.id,
        movementType: 'Manufacturing Production',
        qtyChange: mo.qty,
        resultingBalance: finished.onHand,
        reference: mo.id,
      });
    }

    setProducts(nextProducts);
    setManufacturingOrders((prev) =>
      prev.map((x) => (x.id === moId ? { ...x, status: 'Completed' as ManufacturingStatus } : x))
    );
    pushAudit({ module: 'Manufacturing', action: 'Completed', recordId: mo.id, oldValue: mo, newValue: { ...mo, status: 'Completed' } });
    pushToast('success', 'Production completed', `${mo.id} has been completed.`);
  };

  const openUserModal = (editing?: AppUser) => {
    if (editing) {
      setUserModal({
        open: true,
        editingId: editing.id,
        form: { name: editing.name, email: editing.email, role: editing.role, access: { ...editing.access } },
      });
      return;
    }

    setUserModal({
      open: true,
      editingId: null,
      form: { name: '', email: '', role: 'Sales User', access: { ...ROLE_ACCESS['Sales User'] } },
    });
  };

  const saveUser = () => {
    const f = userModal.form;
    if (!f.name.trim() || !f.email.trim()) {
      pushToast('error', 'Validation', 'Name and email are required.');
      return;
    }

    if (userModal.editingId) {
      const old = users.find((u) => u.id === userModal.editingId);
      if (!old) {
        return;
      }
      const updated: AppUser = {
        ...old,
        name: f.name,
        email: f.email,
        role: f.role,
        access: f.access,
      };
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      pushAudit({ module: 'User Management', action: 'Updated', recordId: updated.id, oldValue: old, newValue: updated });
      pushToast('success', 'User updated', `${updated.name} updated.`);
    } else {
      const created: AppUser = {
        id: nextId('USER'),
        name: f.name,
        email: f.email,
        role: f.role,
        access: f.access,
      };
      setUsers((prev) => [created, ...prev]);
      pushAudit({ module: 'User Management', action: 'Created', recordId: created.id, newValue: created });
      pushToast('success', 'User created', `${created.name} added.`);
    }

    setUserModal((prev) => ({ ...prev, open: false }));
  };

  const deleteUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) {
      return;
    }
    setConfirmDialog({
      open: true,
      title: 'Delete user?',
      message: `Remove ${target.name} from access control?`,
      onConfirm: () => {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        pushAudit({ module: 'User Management', action: 'Deleted', recordId: target.id, oldValue: target });
        pushToast('warning', 'User deleted', `${target.name} removed.`);
      },
    });
  };

  useEffect(() => {
    if (currentUser && currentUser.access[activeView] === 'none') {
      setActiveView('dashboard');
    }
  }, [currentUser, activeView]);

  const kpis = useMemo(
    () => [
      {
        label: 'Total Sales Orders',
        value: salesOrders.length,
        trend: '+8.4%',
        icon: ShoppingCart,
        border: 'border-l-indigo-500',
      },
      {
        label: 'Pending Deliveries',
        value: salesOrders.filter((s) => ['Confirmed', 'Partially Delivered'].includes(s.status)).length,
        trend: '+2.1%',
        icon: Truck,
        border: 'border-l-amber-500',
      },
      {
        label: 'Manufacturing Orders',
        value: manufacturingOrders.length,
        trend: '+4.6%',
        icon: Factory,
        border: 'border-l-indigo-500',
      },
      {
        label: 'Delayed Orders',
        value: manufacturingOrders.filter((m) => m.status !== 'Completed').length,
        trend: '-1.3%',
        icon: TriangleAlert,
        border: 'border-l-rose-500',
      },
      {
        label: 'Total Purchases',
        value: purchaseOrders.length,
        trend: '+11.2%',
        icon: Package,
        border: 'border-l-emerald-500',
      },
      {
        label: 'Partial Receipts',
        value: purchaseOrders.filter((p) => p.status === 'Partially Received').length,
        trend: '+0.7%',
        icon: Boxes,
        border: 'border-l-amber-500',
      },
    ],
    [salesOrders, manufacturingOrders, purchaseOrders]
  );

  const stockAlerts = products.filter((p) => p.onHand < 20);

  const procurementQueue = [
    ...purchaseOrders.filter((po) => po.source === 'Auto-Triggered' && po.status !== 'Fully Received'),
    ...manufacturingOrders.filter((mo) => mo.source === 'Auto-Triggered' && mo.status !== 'Completed'),
  ];

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6">
        <div className={`${classes.glass} w-full max-w-md p-8`}>
          <div className="text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
              <Factory className="text-indigo-600" size={22} />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Shiv Furniture Works</h1>
            <p className="text-sm text-slate-500 mt-1">Welcome back. Let us pick up where you left off.</p>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-slate-600">Work account</label>
              <select
                className={`${classes.input} mt-1`}
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              >
                {SEEDED_USERS.map((u) => (
                  <option key={u.id} value={u.email} className="bg-white">
                    {u.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-600">Password</label>
              <input
                type="password"
                className={`${classes.input} mt-1`}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label className="text-sm text-slate-600">Access profile</label>
              <select className={`${classes.input} mt-1`} value={loginRole} onChange={(e) => setLoginRole(e.target.value as UserRole)}>
                {(Object.keys(ROLE_ACCESS) as UserRole[]).map((r) => (
                  <option key={r} value={r} className="bg-white">
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className={`${classes.btnPrimary} w-full justify-center`}
              onClick={() => {
                const user = users.find((u) => u.email === loginEmail && u.role === loginRole);
                if (!user || loginPassword.length < 1) {
                  pushToast('error', 'Login failed', 'Invalid user or password.');
                  return;
                }
                setCurrentUser(user);
                setActiveView('dashboard');
              }}
            >
              Continue to workspace
            </button>
          </div>

          <p className="text-xs text-slate-500 mt-4">Demo mode: choose a profile and enter any password to explore.</p>
        </div>

        <ToastStack toasts={toasts} dismiss={(id) => setToasts((prev) => prev.filter((x) => x.id !== id))} />
      </div>
    );
  }

  const breadcrumb = {
    dashboard: 'Dashboard',
    products: 'Products',
    sales: 'Sales Orders',
    purchase: 'Purchase Orders',
    manufacturing: 'Manufacturing',
    bom: 'Bill of Materials',
    stockLedger: 'Stock Ledger',
    auditLogs: 'Audit Logs',
    users: 'User Management',
  }[activeView];

  const greeting = `${timeGreeting()}, ${currentUser.name.split(' ')[0]}`;

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(99,102,241,0.15),transparent_35%),radial-gradient(circle_at_85%_85%,rgba(16,185,129,0.08),transparent_35%)]" />
      <div className="flex min-h-screen">
        <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} fixed left-0 top-0 h-screen border-r border-slate-200 bg-white/90 backdrop-blur transition-all duration-200 shadow-sm`}>
          <div className="h-16 border-b border-slate-200 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                <Factory size={16} className="text-indigo-600" />
              </div>
              {!sidebarCollapsed && <span className="font-semibold tracking-tight text-slate-900">Mini ERP</span>}
            </div>
            {!sidebarCollapsed && <span className={statusBadge(currentUser.role)}>{currentUser.role}</span>}
          </div>

          <div className="h-[calc(100vh-8rem)] overflow-y-auto p-3 space-y-3">
            {navGroups.map((group) => (
              <div key={group.key} className="rounded-xl border border-slate-200 bg-white/70">
                <button
                  className="w-full flex items-center justify-between px-3 py-2 text-xs tracking-wide text-slate-500 hover:text-slate-700 transition-all duration-200"
                  onClick={() => setGroups((prev) => ({ ...prev, [group.key]: !prev[group.key] }))}
                  type="button"
                >
                  <span>{group.key}</span>
                  {groups[group.key] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>

                {groups[group.key] && (
                  <nav className="px-2 pb-2 space-y-1">
                    {group.items
                      .filter((item) => currentUser.access[item.key] !== 'none')
                      .map((item) => {
                        const Icon = item.icon;
                        const active = activeView === item.key;
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => setActiveView(item.key)}
                            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 border ${
                              active
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                : 'bg-transparent border-transparent hover:border-slate-200 hover:bg-slate-100 text-slate-600'
                            }`}
                          >
                            <Icon size={16} />
                            {!sidebarCollapsed && <span>{item.label}</span>}
                          </button>
                        );
                      })}
                  </nav>
                )}
              </div>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-3 bg-white/95">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                <UserCircle2 size={18} className="text-slate-500" />
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate text-slate-900">{currentUser.name}</p>
                  <p className="text-xs text-slate-500 truncate">{currentUser.role}</p>
                </div>
              )}
            </div>
            <button
              type="button"
              className={`${classes.btnSecondary} mt-3 w-full justify-center`}
              onClick={() => {
                setCurrentUser(null);
                setLoginPassword('');
              }}
            >
              Logout
            </button>
          </div>
        </aside>

        <div className={`${sidebarCollapsed ? 'ml-20' : 'ml-64'} relative z-10 w-full transition-all duration-200`}>
          <header className="h-16 border-b border-slate-200 bg-white/90 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-4">
              <button type="button" className={classes.btnSecondary} onClick={() => setSidebarCollapsed((v) => !v)}>
                <Grid3X3 size={16} />
                <span className="hidden md:inline">Menu</span>
              </button>
              <div>
                <p className="text-xs text-slate-500">Workspace / {breadcrumb}</p>
                <p className="text-sm font-medium tracking-tight text-slate-900">{greeting}</p>
              </div>
            </div>

            <div className="hidden lg:flex min-w-80 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400">
              <Search size={14} className="mr-2 text-slate-400" />
              Search records, orders, or people...
            </div>

            <div className="flex items-center gap-3">
              <span className={statusBadge(currentUser.role)}>{currentUser.role}</span>
              <button type="button" className={`${classes.btnSecondary} !px-2.5`}>
                <Bell size={16} />
              </button>
            </div>
          </header>

          <main className="p-6 space-y-6">
            {activeView === 'dashboard' && ensureAuthorized('dashboard') && (
              <section className="space-y-6">
                <div className={`${classes.glass} p-4 sm:p-5`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-gray-400">Today at a glance</p>
                      <h2 className="mt-1 text-xl font-semibold tracking-tight">{breadcrumb} overview</h2>
                    </div>
                    <div className="rounded-lg border border-gray-800 bg-gray-900/70 px-3 py-2 text-sm text-gray-300">
                      {prettyDate(dateToday())}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
                  {kpis.map((kpi) => (
                    <div key={kpi.label} className={`${classes.glass} p-4 border-l-4 ${kpi.border} hover:border-gray-600 transition-all duration-200`}>
                      <div className="flex items-start justify-between">
                        <p className="text-[11px] uppercase tracking-wide text-gray-400">{kpi.label}</p>
                        <kpi.icon size={16} className="text-gray-400" />
                      </div>
                      <p className="mt-2 text-2xl font-semibold font-mono leading-tight">{kpi.value}</p>
                      <p className="text-xs text-emerald-300 mt-1">Trend: {kpi.trend}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div className={classes.glass}>
                    <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                      <h3 className="font-medium">Recent Sales Orders</h3>
                      <span className="text-xs text-gray-400">Last 5</span>
                    </div>
                    <TableWrap>
                      <table className="min-w-full text-sm">
                        <thead className="sticky top-0 bg-gray-900 z-10">
                          <tr className="text-left text-gray-400 border-b border-gray-800">
                            <th className="px-3 py-2">SO Number</th>
                            <th className="px-3 py-2">Customer</th>
                            <th className="px-3 py-2">Total</th>
                            <th className="px-3 py-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {salesOrders.slice(0, 5).map((so, idx) => (
                            <tr
                              key={so.id}
                              className={`border-b border-gray-800/70 ${idx % 2 === 0 ? 'bg-gray-900/30' : ''} hover:bg-gray-800/50`}
                            >
                              <td className="px-3 py-2 font-mono">{so.id}</td>
                              <td className="px-3 py-2">{so.customerName}</td>
                              <td className="px-3 py-2 font-mono">{money(so.total)}</td>
                              <td className="px-3 py-2">
                                <span className={statusBadge(so.status)}>{so.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </TableWrap>
                  </div>

                  <div className={classes.glass}>
                    <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                      <h3 className="font-medium">Recent Manufacturing Orders</h3>
                      <span className="text-xs text-gray-400">Last 5</span>
                    </div>
                    <TableWrap>
                      <table className="min-w-full text-sm">
                        <thead className="sticky top-0 bg-gray-900 z-10">
                          <tr className="text-left text-gray-400 border-b border-gray-800">
                            <th className="px-3 py-2">MO Number</th>
                            <th className="px-3 py-2">Product</th>
                            <th className="px-3 py-2">Qty</th>
                            <th className="px-3 py-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {manufacturingOrders.slice(0, 5).map((mo, idx) => (
                            <tr
                              key={mo.id}
                              className={`border-b border-gray-800/70 ${idx % 2 === 0 ? 'bg-gray-900/30' : ''} hover:bg-gray-800/50`}
                            >
                              <td className="px-3 py-2 font-mono">{mo.id}</td>
                              <td className="px-3 py-2">{getProduct(mo.productId)?.name ?? '-'}</td>
                              <td className="px-3 py-2 font-mono">{qtyText(mo.qty)}</td>
                              <td className="px-3 py-2">
                                <span className={statusBadge(mo.status)}>{mo.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </TableWrap>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div className={`${classes.glass} p-4`}>
                    <h3 className="font-medium mb-3">Stock Alerts</h3>
                    <div className="space-y-2">
                      {stockAlerts.length === 0 && <EmptyState icon={<Boxes size={20} />} message="No low stock alerts" />}
                      {stockAlerts.map((p) => (
                        <div key={p.id} className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 flex items-center justify-between">
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-xs text-amber-200">On Hand: {qtyText(p.onHand)}</p>
                          </div>
                          <span className={statusBadge('Partially')}>Low</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`${classes.glass} p-4`}>
                    <h3 className="font-medium mb-3">Procurement Queue</h3>
                    <div className="space-y-2">
                      {procurementQueue.length === 0 && <EmptyState icon={<Package size={20} />} message="No pending procurement" />}
                      {procurementQueue.map((item) => (
                        <div key={item.id} className="rounded-xl border border-gray-700 bg-gray-900/50 p-3 flex items-center justify-between">
                          <div>
                            <p className="font-mono text-sm">{item.id}</p>
                            <p className="text-xs text-gray-400">{'vendorName' in item ? 'Purchase Queue' : 'Manufacturing Queue'}</p>
                          </div>
                          <span className={statusBadge('Draft')}>{'status' in item ? item.status : 'Pending'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeView === 'products' && ensureAuthorized('products') && (
              <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold">Products</h2>
                  <button type="button" className={classes.btnPrimary} onClick={() => openProductModal()}>
                    <Plus size={16} /> New Product
                  </button>
                </div>

                <div className={`${classes.glass} p-4 space-y-3`}>
                  <div className="flex flex-wrap gap-3 items-center">
                    <div className="relative min-w-64 flex-1 max-w-md">
                      <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
                      <input
                        className={`${classes.input} pl-9`}
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Search products"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      {(['All', 'Purchase', 'Manufacturing'] as const).map((f) => (
                        <button
                          key={f}
                          className={`${classes.btnSecondary} ${productProcFilter === f ? '!bg-indigo-500/20 !border-indigo-500/40 text-indigo-200' : ''}`}
                          type="button"
                          onClick={() => setProductProcFilter(f)}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <TableWrap>
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 bg-gray-900 z-10">
                        <tr className="text-left text-gray-400 border-b border-gray-800">
                          <th className="px-3 py-2">Product Name</th>
                          <th className="px-3 py-2">Sales Price</th>
                          <th className="px-3 py-2">Cost Price</th>
                          <th className="px-3 py-2">On Hand</th>
                          <th className="px-3 py-2">Reserved</th>
                          <th className="px-3 py-2">Free to Use</th>
                          <th className="px-3 py-2">Procurement Type</th>
                          <th className="px-3 py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((p, idx) => {
                          const free = getFree(p);
                          return (
                            <tr
                              key={p.id}
                              className={`border-b border-gray-800/70 ${idx % 2 === 0 ? 'bg-gray-900/30' : ''} hover:bg-gray-800/50 cursor-pointer`}
                              onClick={() => setSelectedProductId(p.id)}
                            >
                              <td className="px-3 py-2">{p.name}</td>
                              <td className="px-3 py-2 font-mono">{money(p.salesPrice)}</td>
                              <td className="px-3 py-2 font-mono">{money(p.costPrice)}</td>
                              <td className="px-3 py-2 font-mono">{qtyText(p.onHand)}</td>
                              <td className="px-3 py-2 font-mono">{qtyText(p.reserved)}</td>
                              <td className={`px-3 py-2 font-mono ${free > 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{qtyText(free)}</td>
                              <td className="px-3 py-2">{p.procurementType}</td>
                              <td className="px-3 py-2">
                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                  <button className={classes.btnSecondary} type="button" onClick={() => setSelectedProductId(p.id)}>
                                    View
                                  </button>
                                  <button className={classes.btnSecondary} type="button" onClick={() => openProductModal(p)}>
                                    <Pencil size={14} />
                                  </button>
                                  <button className={classes.btnDanger} type="button" onClick={() => deleteProduct(p.id)}>
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </TableWrap>

                  {filteredProducts.length === 0 && <EmptyState icon={<Package size={20} />} message="No products found" />}
                </div>
              </section>
            )}

            {activeView === 'sales' && ensureAuthorized('sales') && (
              <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold">Sales Orders</h2>
                  <button type="button" className={classes.btnPrimary} onClick={() => openSalesModal()}>
                    <Plus size={16} /> Create Sales Order
                  </button>
                </div>

                <div className={`${classes.glass} p-4 space-y-3`}>
                  <div className="flex flex-wrap gap-3 items-center">
                    <div className="relative min-w-64 flex-1 max-w-md">
                      <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
                      <input
                        className={`${classes.input} pl-9`}
                        value={salesSearch}
                        onChange={(e) => setSalesSearch(e.target.value)}
                        placeholder="Search by SO or customer"
                      />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {(['All', 'Draft', 'Confirmed', 'Delivered', 'Cancelled'] as const).map((f) => (
                        <button
                          key={f}
                          type="button"
                          className={`${classes.btnSecondary} ${salesFilter === f ? '!bg-indigo-500/20 !border-indigo-500/40 text-indigo-200' : ''}`}
                          onClick={() => setSalesFilter(f)}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <TableWrap>
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 bg-gray-900 z-10">
                        <tr className="text-left text-gray-400 border-b border-gray-800">
                          <th className="px-3 py-2">SO Number</th>
                          <th className="px-3 py-2">Customer</th>
                          <th className="px-3 py-2">Date</th>
                          <th className="px-3 py-2">Products</th>
                          <th className="px-3 py-2">Total</th>
                          <th className="px-3 py-2">Status</th>
                          <th className="px-3 py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSales.map((so, idx) => (
                          <tr key={so.id} className={`border-b border-gray-800/70 ${idx % 2 === 0 ? 'bg-gray-900/30' : ''} hover:bg-gray-800/50`}>
                            <td className="px-3 py-2 font-mono">{so.id}</td>
                            <td className="px-3 py-2">{so.customerName}</td>
                            <td className="px-3 py-2">{so.orderDate}</td>
                            <td className="px-3 py-2">{so.lines.length}</td>
                            <td className="px-3 py-2 font-mono">{money(so.total)}</td>
                            <td className="px-3 py-2"><span className={statusBadge(so.status)}>{so.status}</span></td>
                            <td className="px-3 py-2">
                              <div className="flex gap-2">
                                <button type="button" className={classes.btnSecondary} onClick={() => setSelectedSalesDetailId(so.id)}>
                                  View
                                </button>
                                <button type="button" className={classes.btnSecondary} onClick={() => openSalesModal(so)}>
                                  <Pencil size={14} />
                                </button>
                                {so.status === 'Draft' && (
                                  <button type="button" className={classes.btnPrimary} onClick={() => confirmSalesOrder(so.id)}>
                                    Confirm
                                  </button>
                                )}
                                {so.status === 'Confirmed' || so.status === 'Partially Delivered' ? (
                                  <button type="button" className={classes.btnPrimary} onClick={() => openDeliverModal(so)}>
                                    Deliver
                                  </button>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TableWrap>
                </div>
              </section>
            )}

            {activeView === 'purchase' && ensureAuthorized('purchase') && (
              <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold">Purchase Orders</h2>
                  <button type="button" className={classes.btnPrimary} onClick={() => openPurchaseModal()}>
                    <Plus size={16} /> Create Purchase Order
                  </button>
                </div>

                <div className={`${classes.glass} p-4 space-y-3`}>
                  <div className="relative min-w-64 max-w-md">
                    <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
                    <input
                      className={`${classes.input} pl-9`}
                      value={poSearch}
                      onChange={(e) => setPoSearch(e.target.value)}
                      placeholder="Search PO"
                    />
                  </div>
                  <TableWrap>
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 bg-gray-900 z-10">
                        <tr className="text-left text-gray-400 border-b border-gray-800">
                          <th className="px-3 py-2">PO Number</th>
                          <th className="px-3 py-2">Vendor</th>
                          <th className="px-3 py-2">Date</th>
                          <th className="px-3 py-2">Products</th>
                          <th className="px-3 py-2">Total Cost</th>
                          <th className="px-3 py-2">Status</th>
                          <th className="px-3 py-2">Source</th>
                          <th className="px-3 py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPurchase.map((po, idx) => (
                          <tr key={po.id} className={`border-b border-gray-800/70 ${idx % 2 === 0 ? 'bg-gray-900/30' : ''} hover:bg-gray-800/50`}>
                            <td className="px-3 py-2 font-mono">{po.id}</td>
                            <td className="px-3 py-2">{po.vendorName}</td>
                            <td className="px-3 py-2">{po.orderDate}</td>
                            <td className="px-3 py-2">{po.lines.length}</td>
                            <td className="px-3 py-2 font-mono">{money(po.totalCost)}</td>
                            <td className="px-3 py-2"><span className={statusBadge(po.status)}>{po.status}</span></td>
                            <td className="px-3 py-2"><span className={statusBadge(po.source === 'Manual' ? 'Draft' : 'Confirmed')}>{po.source}</span></td>
                            <td className="px-3 py-2">
                              <div className="flex gap-2">
                                <button className={classes.btnSecondary} type="button" onClick={() => openPurchaseModal(po)}>
                                  <Pencil size={14} />
                                </button>
                                <button className={classes.btnPrimary} type="button" onClick={() => openReceiveModal(po)}>
                                  Receive
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TableWrap>
                </div>
              </section>
            )}

            {activeView === 'bom' && ensureAuthorized('bom') && (
              <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold">Bill of Materials</h2>
                  <button type="button" className={classes.btnPrimary} onClick={() => openBomModal()}>
                    <Plus size={16} /> Create BoM
                  </button>
                </div>

                <div className={`${classes.glass} p-4`}>
                  <TableWrap>
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 bg-gray-900 z-10">
                        <tr className="text-left text-gray-400 border-b border-gray-800">
                          <th className="px-3 py-2">BoM ID</th>
                          <th className="px-3 py-2">Finished Product</th>
                          <th className="px-3 py-2">Components Count</th>
                          <th className="px-3 py-2">Operations Count</th>
                          <th className="px-3 py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {boms.map((bom, idx) => (
                          <tr key={bom.id} className={`border-b border-gray-800/70 ${idx % 2 === 0 ? 'bg-gray-900/30' : ''} hover:bg-gray-800/50`}>
                            <td className="px-3 py-2 font-mono">{bom.id}</td>
                            <td className="px-3 py-2">{getProduct(bom.finishedProductId)?.name ?? '-'}</td>
                            <td className="px-3 py-2">{bom.components.length}</td>
                            <td className="px-3 py-2">{bom.operations.length}</td>
                            <td className="px-3 py-2">
                              <button className={classes.btnSecondary} type="button" onClick={() => openBomModal(bom)}>
                                <Pencil size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TableWrap>
                </div>
              </section>
            )}

            {activeView === 'manufacturing' && ensureAuthorized('manufacturing') && (
              <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold">Manufacturing Orders</h2>
                  <button type="button" className={classes.btnPrimary} onClick={() => setMoModal((prev) => ({ ...prev, open: true }))}>
                    <Plus size={16} /> Create MO
                  </button>
                </div>

                <div className={`${classes.glass} p-4 space-y-3`}>
                  <div className="relative min-w-64 max-w-md">
                    <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
                    <input className={`${classes.input} pl-9`} value={moSearch} onChange={(e) => setMoSearch(e.target.value)} placeholder="Search MO" />
                  </div>

                  <TableWrap>
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 bg-gray-900 z-10">
                        <tr className="text-left text-gray-400 border-b border-gray-800">
                          <th className="px-3 py-2">MO Number</th>
                          <th className="px-3 py-2">Product</th>
                          <th className="px-3 py-2">Qty</th>
                          <th className="px-3 py-2">Assignee</th>
                          <th className="px-3 py-2">Status</th>
                          <th className="px-3 py-2">Source</th>
                          <th className="px-3 py-2">Scheduled Date</th>
                          <th className="px-3 py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMO.map((mo, idx) => (
                          <tr key={mo.id} className={`border-b border-gray-800/70 ${idx % 2 === 0 ? 'bg-gray-900/30' : ''} hover:bg-gray-800/50`}>
                            <td className="px-3 py-2 font-mono">{mo.id}</td>
                            <td className="px-3 py-2">{getProduct(mo.productId)?.name ?? '-'}</td>
                            <td className="px-3 py-2 font-mono">{qtyText(mo.qty)}</td>
                            <td className="px-3 py-2">{mo.assignee}</td>
                            <td className="px-3 py-2"><span className={statusBadge(mo.status)}>{mo.status}</span></td>
                            <td className="px-3 py-2"><span className={statusBadge(mo.source === 'Manual' ? 'Draft' : 'Confirmed')}>{mo.source}</span></td>
                            <td className="px-3 py-2">{mo.scheduledDate}</td>
                            <td className="px-3 py-2">
                              <div className="flex gap-2">
                                <button className={classes.btnSecondary} type="button" onClick={() => setSelectedMoId(mo.id)}>
                                  View
                                </button>
                                {mo.status === 'Draft' && (
                                  <button className={classes.btnPrimary} type="button" onClick={() => startProduction(mo.id)}>
                                    Start
                                  </button>
                                )}
                                {mo.status === 'In Progress' && (
                                  <button className={classes.btnPrimary} type="button" onClick={() => completeProduction(mo.id)}>
                                    Complete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TableWrap>
                </div>
              </section>
            )}

            {activeView === 'stockLedger' && ensureAuthorized('stockLedger') && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">Stock Ledger</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <SummaryCard title="Total In" value={money(filteredLedger.filter((r) => r.qtyChange > 0).reduce((s, r) => s + r.qtyChange, 0))} tone="emerald" />
                  <SummaryCard title="Total Out" value={money(Math.abs(filteredLedger.filter((r) => r.qtyChange < 0).reduce((s, r) => s + r.qtyChange, 0)))} tone="rose" />
                  <SummaryCard title="Net Movement" value={money(filteredLedger.reduce((s, r) => s + r.qtyChange, 0))} tone="indigo" />
                </div>

                <div className={`${classes.glass} p-4 space-y-3`}>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <select className={classes.input} value={ledgerProductFilter} onChange={(e) => setLedgerProductFilter(e.target.value)}>
                      <option value="All">All Products</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id} className="bg-gray-900">
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <select className={classes.input} value={ledgerTypeFilter} onChange={(e) => setLedgerTypeFilter(e.target.value as 'All' | MovementType)}>
                      <option value="All">All Movements</option>
                      {['Sale Delivery', 'Purchase Receipt', 'Manufacturing Consumption', 'Manufacturing Production'].map((t) => (
                        <option key={t} value={t} className="bg-gray-900">
                          {t}
                        </option>
                      ))}
                    </select>
                    <input type="date" className={classes.input} value={ledgerFrom} onChange={(e) => setLedgerFrom(e.target.value)} />
                    <input type="date" className={classes.input} value={ledgerTo} onChange={(e) => setLedgerTo(e.target.value)} />
                  </div>

                  <TableWrap>
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 bg-gray-900 z-10">
                        <tr className="text-left text-gray-400 border-b border-gray-800">
                          <th className="px-3 py-2">Date</th>
                          <th className="px-3 py-2">Product</th>
                          <th className="px-3 py-2">Movement Type</th>
                          <th className="px-3 py-2">Qty Change</th>
                          <th className="px-3 py-2">Resulting Balance</th>
                          <th className="px-3 py-2">Reference</th>
                          <th className="px-3 py-2">User</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLedger.map((row, idx) => (
                          <tr key={row.id} className={`border-b border-gray-800/70 ${idx % 2 === 0 ? 'bg-gray-900/30' : ''} hover:bg-gray-800/50`}>
                            <td className="px-3 py-2">{row.date.slice(0, 10)}</td>
                            <td className="px-3 py-2">{getProduct(row.productId)?.name ?? '-'}</td>
                            <td className="px-3 py-2"><span className={statusBadge(row.movementType)}>{row.movementType}</span></td>
                            <td className={`px-3 py-2 font-mono ${row.qtyChange < 0 ? 'text-rose-300' : 'text-emerald-300'}`}>
                              {row.qtyChange > 0 ? `+${row.qtyChange}` : row.qtyChange}
                            </td>
                            <td className="px-3 py-2 font-mono">{qtyText(row.resultingBalance)}</td>
                            <td className="px-3 py-2 font-mono">{row.reference}</td>
                            <td className="px-3 py-2">{row.user}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TableWrap>
                </div>
              </section>
            )}

            {activeView === 'auditLogs' && ensureAuthorized('auditLogs') && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">Audit Logs</h2>

                <div className={`${classes.glass} p-4 space-y-3`}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
                      <input className={`${classes.input} pl-9`} value={auditSearch} onChange={(e) => setAuditSearch(e.target.value)} placeholder="Search audit logs" />
                    </div>
                    <select className={classes.input} value={auditModuleFilter} onChange={(e) => setAuditModuleFilter(e.target.value)}>
                      <option value="All">All Modules</option>
                      {['Products', 'Sales', 'Purchase', 'Manufacturing', 'BoM', 'User Management'].map((m) => (
                        <option key={m} value={m} className="bg-gray-900">
                          {m}
                        </option>
                      ))}
                    </select>
                    <select className={classes.input} value={auditActionFilter} onChange={(e) => setAuditActionFilter(e.target.value)}>
                      <option value="All">All Actions</option>
                      {['Created', 'Updated', 'Deleted', 'Confirmed', 'Delivered', 'Completed'].map((a) => (
                        <option key={a} value={a} className="bg-gray-900">
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>

                  <TableWrap>
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 bg-gray-900 z-10">
                        <tr className="text-left text-gray-400 border-b border-gray-800">
                          <th className="px-3 py-2">Timestamp</th>
                          <th className="px-3 py-2">User</th>
                          <th className="px-3 py-2">Role</th>
                          <th className="px-3 py-2">Module</th>
                          <th className="px-3 py-2">Action</th>
                          <th className="px-3 py-2">Record ID</th>
                          <th className="px-3 py-2">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAudit.map((log, idx) => (
                          <>
                            <tr key={log.id} className={`border-b border-gray-800/70 ${idx % 2 === 0 ? 'bg-gray-900/30' : ''} hover:bg-gray-800/50`}>
                              <td className="px-3 py-2">{log.timestamp.replace('T', ' ').slice(0, 19)}</td>
                              <td className="px-3 py-2">{log.user}</td>
                              <td className="px-3 py-2">{log.role}</td>
                              <td className="px-3 py-2">{log.module}</td>
                              <td className="px-3 py-2"><span className={statusBadge(log.action)}>{log.action}</span></td>
                              <td className="px-3 py-2 font-mono">{log.recordId}</td>
                              <td className="px-3 py-2">
                                <button className={classes.btnSecondary} type="button" onClick={() => setExpandedAudit((prev) => (prev === log.id ? null : log.id))}>
                                  {expandedAudit === log.id ? 'Hide' : 'Expand'}
                                </button>
                              </td>
                            </tr>
                            {expandedAudit === log.id && (
                              <tr className="border-b border-gray-800/70 bg-gray-900/20">
                                <td colSpan={7} className="px-3 py-3">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <pre className="rounded-lg border border-gray-800 bg-gray-950 p-3 text-xs overflow-auto">{JSON.stringify(log.oldValue ?? {}, null, 2)}</pre>
                                    <pre className="rounded-lg border border-gray-800 bg-gray-950 p-3 text-xs overflow-auto">{JSON.stringify(log.newValue ?? {}, null, 2)}</pre>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        ))}
                      </tbody>
                    </table>
                  </TableWrap>
                </div>
              </section>
            )}

            {activeView === 'users' && ensureAuthorized('users') && (
              <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold">User Management</h2>
                  <button className={classes.btnPrimary} type="button" onClick={() => openUserModal()}>
                    <Plus size={16} /> Add User
                  </button>
                </div>

                <div className={`${classes.glass} p-4`}>
                  <TableWrap>
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 bg-gray-900 z-10">
                        <tr className="text-left text-gray-400 border-b border-gray-800">
                          <th className="px-3 py-2">Name</th>
                          <th className="px-3 py-2">Email</th>
                          <th className="px-3 py-2">Role</th>
                          <th className="px-3 py-2">Module Access Grid</th>
                          <th className="px-3 py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u, idx) => (
                          <tr key={u.id} className={`border-b border-gray-800/70 ${idx % 2 === 0 ? 'bg-gray-900/30' : ''} hover:bg-gray-800/50`}>
                            <td className="px-3 py-2">{u.name}</td>
                            <td className="px-3 py-2">{u.email}</td>
                            <td className="px-3 py-2">{u.role}</td>
                            <td className="px-3 py-2">
                              <div className="flex flex-wrap gap-1">
                                {(
                                  [
                                    ['products', 'Products'],
                                    ['sales', 'Sales'],
                                    ['purchase', 'Purchase'],
                                    ['manufacturing', 'Manufacturing'],
                                    ['bom', 'BoM'],
                                    ['stockLedger', 'Inventory'],
                                    ['auditLogs', 'Audit Logs'],
                                  ] as [ViewKey, string][]
                                ).map(([k, label]) => (
                                  <span key={k} className={statusBadge(u.access[k] === 'full' ? 'Confirmed' : u.access[k] === 'view' ? 'Draft' : 'Cancelled')}>
                                    {label}: {u.access[k] === 'full' ? 'Full' : u.access[k] === 'view' ? 'View' : 'None'}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-3 py-2">
                              <div className="flex gap-2">
                                <button className={classes.btnSecondary} type="button" onClick={() => openUserModal(u)}>
                                  <Pencil size={14} />
                                </button>
                                <button className={classes.btnDanger} type="button" onClick={() => deleteUser(u.id)}>
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TableWrap>
                </div>
              </section>
            )}

            {!ensureAuthorized(activeView) && (
              <div className={`${classes.glass} p-8`}>
                <EmptyState icon={<XCircle size={24} />} message="You do not have access to this module." />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Right side detail panel */}
      <div
        className={`fixed right-0 top-0 h-screen w-96 max-w-full bg-gray-900/95 backdrop-blur border-l border-gray-800 z-40 transition-transform duration-200 ${
          selectedProduct || selectedMO || selectedSalesDetail ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-16 border-b border-gray-800 px-4 flex items-center justify-between">
          <h3 className="font-medium">Detail View</h3>
          <button
            type="button"
            className={classes.btnSecondary}
            onClick={() => {
              setSelectedProductId(null);
              setSelectedMoId(null);
              setSelectedSalesDetailId(null);
            }}
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100vh-4rem)] space-y-4">
          {selectedProduct && (
            <>
              <div className={classes.glass + ' p-4'}>
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold">{selectedProduct.name}</h4>
                  <span className={statusBadge('Draft')}>{selectedProduct.id}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <MiniStat title="On Hand" value={qtyText(selectedProduct.onHand)} />
                <MiniStat title="Reserved" value={qtyText(selectedProduct.reserved)} />
                <MiniStat title="Free" value={qtyText(getFree(selectedProduct))} />
              </div>

              <div className={classes.glass + ' p-4'}>
                <h5 className="font-medium mb-2">Procurement Config</h5>
                <p className="text-sm text-gray-300">Type: {selectedProduct.procurementType}</p>
                <p className="text-sm text-gray-300">Procure on Demand: {selectedProduct.procureOnDemand ? 'Yes' : 'No'}</p>
                {selectedProduct.preferredVendor ? <p className="text-sm text-gray-300">Preferred Vendor: {selectedProduct.preferredVendor}</p> : null}
                {selectedProduct.bomReference ? <p className="text-sm text-gray-300">BoM Reference: {selectedProduct.bomReference}</p> : null}
              </div>

              <div className={classes.glass + ' p-4'}>
                <h5 className="font-medium mb-2">Related Sales Orders</h5>
                <div className="space-y-2">
                  {salesOrders
                    .filter((so) => so.lines.some((line) => line.productId === selectedProduct.id))
                    .slice(0, 5)
                    .map((so) => (
                      <div key={so.id} className="rounded-lg border border-gray-800 p-2 flex items-center justify-between">
                        <span className="font-mono text-sm">{so.id}</span>
                        <span className={statusBadge(so.status)}>{so.status}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className={classes.glass + ' p-4'}>
                <h5 className="font-medium mb-2">Related Manufacturing Orders</h5>
                <div className="space-y-2">
                  {manufacturingOrders
                    .filter((mo) => mo.productId === selectedProduct.id)
                    .slice(0, 5)
                    .map((mo) => (
                      <div key={mo.id} className="rounded-lg border border-gray-800 p-2 flex items-center justify-between">
                        <span className="font-mono text-sm">{mo.id}</span>
                        <span className={statusBadge(mo.status)}>{mo.status}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className={classes.glass + ' p-4'}>
                <h5 className="font-medium mb-2">Stock Movement (last 5)</h5>
                <div className="space-y-2">
                  {stockLedger
                    .filter((entry) => entry.productId === selectedProduct.id)
                    .slice(0, 5)
                    .map((entry) => (
                      <div key={entry.id} className="rounded-lg border border-gray-800 p-2 text-xs">
                        <div className="flex justify-between">
                          <span>{entry.date.slice(0, 10)}</span>
                          <span className={statusBadge(entry.movementType)}>{entry.movementType}</span>
                        </div>
                        <p className="mt-1 font-mono">{entry.qtyChange > 0 ? `+${entry.qtyChange}` : entry.qtyChange}</p>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}

          {selectedSalesDetail && (
            <>
              <div className={classes.glass + ' p-4'}>
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold">Sales Order {selectedSalesDetail.id}</h4>
                  <span className={statusBadge(selectedSalesDetail.status)}>{selectedSalesDetail.status}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{selectedSalesDetail.customerName}</p>
              </div>

              <div className={classes.glass + ' p-4'}>
                <h5 className="font-medium mb-2">Line Items</h5>
                <div className="space-y-2">
                  {selectedSalesDetail.lines.map((line) => {
                    const p = getProduct(line.productId);
                    return (
                      <div key={line.id} className="rounded-lg border border-gray-800 p-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{p?.name ?? '-'}</span>
                          <span className="font-mono">{money(line.unitPrice)}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Ordered: {qtyText(line.orderedQty)} | Delivered: {qtyText(line.deliveredQty)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={classes.glass + ' p-4'}>
                <h5 className="font-medium mb-3">Status Timeline</h5>
                <StatusStepper
                  steps={['Draft', 'Confirmed', 'Partially Delivered', 'Fully Delivered']}
                  current={selectedSalesDetail.status === 'Cancelled' ? 'Draft' : selectedSalesDetail.status}
                />
              </div>
            </>
          )}

          {selectedMO && (
            <>
              <div className={classes.glass + ' p-4'}>
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold">{selectedMO.id}</h4>
                  <span className={statusBadge(selectedMO.status)}>{selectedMO.status}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{getProduct(selectedMO.productId)?.name ?? '-'}</p>
              </div>

              <div className={classes.glass + ' p-4'}>
                <h5 className="font-medium mb-2">Components</h5>
                <div className="space-y-2">
                  {(boms.find((b) => b.id === selectedMO.bomId)?.components ?? []).map((c) => {
                    const p = getProduct(c.productId);
                    const required = c.qty * selectedMO.qty;
                    const available = p?.onHand ?? 0;
                    const enough = available >= required;
                    return (
                      <div key={c.id} className={`rounded-lg border p-2 ${enough ? 'border-gray-800' : 'border-rose-500/40 bg-rose-500/10'}`}>
                        <div className="flex items-center justify-between text-sm">
                          <span>{p?.name ?? '-'}</span>
                          <span className={enough ? 'text-emerald-300' : 'text-rose-300'}>
                            Req {qtyText(required)} / Avl {qtyText(available)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={classes.glass + ' p-4'}>
                <h5 className="font-medium mb-2">Work Orders</h5>
                <div className="space-y-2">
                  {selectedMO.workOrders.map((wo) => (
                    <div key={wo.id} className="rounded-lg border border-gray-800 p-2 flex items-center justify-between">
                      <div>
                        <p className="text-sm">{wo.operationName}</p>
                        <p className="text-xs text-gray-400">
                          {wo.workCenter} · {wo.durationMins} mins
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={statusBadge(wo.status)}>{wo.status}</span>
                        {wo.status !== 'Done' && (
                          <button className={classes.btnSecondary} type="button" onClick={() => markWorkOrderDone(selectedMO.id, wo.id)}>
                            Mark Done
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={classes.glass + ' p-4'}>
                <h5 className="font-medium mb-3">Status Timeline</h5>
                <StatusStepper steps={['Draft', 'In Progress', 'Completed']} current={selectedMO.status} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {productModal.open && (
        <ModalShell title={productModal.editingId ? 'Edit Product' : 'New Product'} onClose={() => setProductModal((prev) => ({ ...prev, open: false }))}>
          <div className="space-y-3">
            <Field label="Product Name">
              <input
                className={classes.input}
                value={productModal.form.name}
                onChange={(e) => setProductModal((prev) => ({ ...prev, form: { ...prev.form, name: e.target.value } }))}
              />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Sales Price (INR)">
                <input
                  type="number"
                  className={classes.input}
                  value={productModal.form.salesPrice}
                  onChange={(e) => setProductModal((prev) => ({ ...prev, form: { ...prev.form, salesPrice: Number(e.target.value) } }))}
                />
              </Field>
              <Field label="Cost Price (INR)">
                <input
                  type="number"
                  className={classes.input}
                  value={productModal.form.costPrice}
                  onChange={(e) => setProductModal((prev) => ({ ...prev, form: { ...prev.form, costPrice: Number(e.target.value) } }))}
                />
              </Field>
            </div>
            <Field label="On Hand Qty">
              <input
                type="number"
                className={classes.input}
                value={productModal.form.onHand}
                onChange={(e) => setProductModal((prev) => ({ ...prev, form: { ...prev.form, onHand: Number(e.target.value) } }))}
              />
            </Field>
            <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 p-3">
              <span className="text-sm">Procure on Demand</span>
              <button
                type="button"
                className={`h-6 w-12 rounded-full p-1 transition-all duration-200 ${productModal.form.procureOnDemand ? 'bg-indigo-500' : 'bg-gray-700'}`}
                onClick={() =>
                  setProductModal((prev) => ({
                    ...prev,
                    form: { ...prev.form, procureOnDemand: !prev.form.procureOnDemand },
                  }))
                }
              >
                <span className={`block h-4 w-4 rounded-full bg-white transition-all duration-200 ${productModal.form.procureOnDemand ? 'translate-x-6' : ''}`} />
              </button>
            </div>
            <Field label="Procurement Type">
              <select
                className={classes.input}
                value={productModal.form.procurementType}
                onChange={(e) =>
                  setProductModal((prev) => ({
                    ...prev,
                    form: { ...prev.form, procurementType: e.target.value as 'Purchase' | 'Manufacturing' },
                  }))
                }
              >
                <option value="Purchase" className="bg-gray-900">Purchase</option>
                <option value="Manufacturing" className="bg-gray-900">Manufacturing</option>
              </select>
            </Field>
            {productModal.form.procurementType === 'Purchase' && (
              <Field label="Preferred Vendor">
                <input
                  className={classes.input}
                  value={productModal.form.preferredVendor}
                  onChange={(e) => setProductModal((prev) => ({ ...prev, form: { ...prev.form, preferredVendor: e.target.value } }))}
                />
              </Field>
            )}
            {productModal.form.procurementType === 'Manufacturing' && (
              <Field label="BoM Reference">
                <select
                  className={classes.input}
                  value={productModal.form.bomReference}
                  onChange={(e) => setProductModal((prev) => ({ ...prev, form: { ...prev.form, bomReference: e.target.value } }))}
                >
                  <option value="" className="bg-gray-900">Select BoM</option>
                  {boms.map((bom) => (
                    <option key={bom.id} value={bom.id} className="bg-gray-900">
                      {bom.id}
                    </option>
                  ))}
                </select>
              </Field>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button className={classes.btnSecondary} type="button" onClick={() => setProductModal((prev) => ({ ...prev, open: false }))}>
                Cancel
              </button>
              <button className={classes.btnPrimary} type="button" onClick={saveProduct}>
                Save Product
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {salesModal.open && (
        <ModalShell title={salesModal.editingId ? 'Edit Sales Order' : 'Create Sales Order'} onClose={() => setSalesModal((prev) => ({ ...prev, open: false }))}>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Customer Name">
                <input className={classes.input} value={salesModal.form.customerName} onChange={(e) => setSalesModal((prev) => ({ ...prev, form: { ...prev.form, customerName: e.target.value } }))} />
              </Field>
              <Field label="Mobile Number">
                <input className={classes.input} value={salesModal.form.mobileNumber} onChange={(e) => setSalesModal((prev) => ({ ...prev, form: { ...prev.form, mobileNumber: e.target.value } }))} />
              </Field>
            </div>
            <Field label="Customer Address">
              <input className={classes.input} value={salesModal.form.customerAddress} onChange={(e) => setSalesModal((prev) => ({ ...prev, form: { ...prev.form, customerAddress: e.target.value } }))} />
            </Field>
            <Field label="Order Date">
              <input type="date" className={classes.input} value={salesModal.form.orderDate} onChange={(e) => setSalesModal((prev) => ({ ...prev, form: { ...prev.form, orderDate: e.target.value } }))} />
            </Field>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Product Lines</p>
                <button
                  type="button"
                  className={classes.btnSecondary}
                  onClick={() =>
                    setSalesModal((prev) => ({
                      ...prev,
                      form: {
                        ...prev.form,
                        lines: [
                          ...prev.form.lines,
                          {
                            id: `SOL-F-${Date.now()}`,
                            productId: products[0]?.id ?? '',
                            orderedQty: 1,
                            unitPrice: products[0]?.salesPrice ?? 0,
                            deliveredQty: 0,
                          },
                        ],
                      },
                    }))
                  }
                >
                  <Plus size={14} /> Add Product line
                </button>
              </div>

              {salesModal.form.lines.map((line, i) => {
                const p = getProduct(line.productId);
                const avail = p ? getFree(p) : 0;
                return (
                  <div key={line.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 rounded-lg border border-gray-800 bg-gray-900/60 p-2">
                    <div className="md:col-span-4">
                      <select
                        className={classes.input}
                        value={line.productId}
                        onChange={(e) => {
                          const productId = e.target.value;
                          const np = getProduct(productId);
                          setSalesModal((prev) => ({
                            ...prev,
                            form: {
                              ...prev.form,
                              lines: prev.form.lines.map((l) =>
                                l.id === line.id
                                  ? { ...l, productId, unitPrice: np?.salesPrice ?? l.unitPrice }
                                  : l
                              ),
                            },
                          }));
                        }}
                      >
                        {products.map((prod) => (
                          <option key={prod.id} value={prod.id} className="bg-gray-900">
                            {prod.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <input
                        type="number"
                        className={classes.input}
                        value={line.orderedQty}
                        onChange={(e) =>
                          setSalesModal((prev) => ({
                            ...prev,
                            form: {
                              ...prev.form,
                              lines: prev.form.lines.map((l) =>
                                l.id === line.id ? { ...l, orderedQty: Number(e.target.value) } : l
                              ),
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <div className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-300">{qtyText(avail)}</div>
                    </div>
                    <div className="md:col-span-2">
                      <input
                        type="number"
                        className={classes.input}
                        value={line.unitPrice}
                        onChange={(e) =>
                          setSalesModal((prev) => ({
                            ...prev,
                            form: {
                              ...prev.form,
                              lines: prev.form.lines.map((l) =>
                                l.id === line.id ? { ...l, unitPrice: Number(e.target.value) } : l
                              ),
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="md:col-span-1 flex items-center text-sm font-mono">{money(line.orderedQty * line.unitPrice)}</div>
                    <div className="md:col-span-1">
                      <button
                        type="button"
                        className={classes.btnDanger}
                        onClick={() =>
                          setSalesModal((prev) => ({
                            ...prev,
                            form: { ...prev.form, lines: prev.form.lines.filter((l) => l.id !== line.id) },
                          }))
                        }
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="md:col-span-12 text-xs text-gray-500">
                      Line {i + 1}: Product | Ordered Qty | Available Qty | Unit Price | Subtotal
                    </div>
                  </div>
                );
              })}
            </div>

            <Field label="Notes">
              <textarea className={classes.input} value={salesModal.form.notes} onChange={(e) => setSalesModal((prev) => ({ ...prev, form: { ...prev.form, notes: e.target.value } }))} rows={3} />
            </Field>

            <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 p-3">
              <p className="text-sm">Sales Person: {currentUser.name}</p>
              <p className="font-mono">Total: {money(salesFormTotal)}</p>
            </div>

            <div className="flex justify-end gap-2">
              <button className={classes.btnSecondary} type="button" onClick={() => setSalesModal((prev) => ({ ...prev, open: false }))}>
                Cancel
              </button>
              <button className={classes.btnPrimary} type="button" onClick={saveSales}>
                Save Order
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {deliverModal.open && (
        <ModalShell title="Deliver Sales Order" onClose={() => setDeliverModal({ open: false, orderId: '', rows: {} })}>
          <div className="space-y-3">
            {(salesOrders.find((x) => x.id === deliverModal.orderId)?.lines ?? []).map((line) => {
              const product = getProduct(line.productId);
              return (
                <div key={line.id} className="rounded-lg border border-gray-800 p-3">
                  <div className="flex items-center justify-between">
                    <p>{product?.name}</p>
                    <p className="text-xs text-gray-400">
                      Remaining: {qtyText(Math.max(0, line.orderedQty - line.deliveredQty))}
                    </p>
                  </div>
                  <input
                    type="number"
                    className={`${classes.input} mt-2`}
                    value={deliverModal.rows[line.id] ?? 0}
                    onChange={(e) =>
                      setDeliverModal((prev) => ({
                        ...prev,
                        rows: { ...prev.rows, [line.id]: Number(e.target.value) },
                      }))
                    }
                  />
                </div>
              );
            })}

            <div className="flex justify-end gap-2">
              <button className={classes.btnSecondary} type="button" onClick={() => setDeliverModal({ open: false, orderId: '', rows: {} })}>
                Cancel
              </button>
              <button className={classes.btnPrimary} type="button" onClick={deliverSalesOrder}>
                Post Delivery
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {purchaseModal.open && (
        <ModalShell title={purchaseModal.editingId ? 'Edit Purchase Order' : 'Create Purchase Order'} onClose={() => setPurchaseModal((prev) => ({ ...prev, open: false }))}>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Vendor Name">
                <input className={classes.input} value={purchaseModal.form.vendorName} onChange={(e) => setPurchaseModal((prev) => ({ ...prev, form: { ...prev.form, vendorName: e.target.value } }))} />
              </Field>
              <Field label="Responsible Person">
                <input className={classes.input} value={purchaseModal.form.responsiblePerson} onChange={(e) => setPurchaseModal((prev) => ({ ...prev, form: { ...prev.form, responsiblePerson: e.target.value } }))} />
              </Field>
            </div>
            <Field label="Vendor Address">
              <input className={classes.input} value={purchaseModal.form.vendorAddress} onChange={(e) => setPurchaseModal((prev) => ({ ...prev, form: { ...prev.form, vendorAddress: e.target.value } }))} />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Order Date">
                <input type="date" className={classes.input} value={purchaseModal.form.orderDate} onChange={(e) => setPurchaseModal((prev) => ({ ...prev, form: { ...prev.form, orderDate: e.target.value } }))} />
              </Field>
              <Field label="Expected Delivery Date">
                <input type="date" className={classes.input} value={purchaseModal.form.expectedDeliveryDate} onChange={(e) => setPurchaseModal((prev) => ({ ...prev, form: { ...prev.form, expectedDeliveryDate: e.target.value } }))} />
              </Field>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Product lines</p>
                <button
                  type="button"
                  className={classes.btnSecondary}
                  onClick={() =>
                    setPurchaseModal((prev) => ({
                      ...prev,
                      form: {
                        ...prev.form,
                        lines: [
                          ...prev.form.lines,
                          {
                            id: `POL-F-${Date.now()}`,
                            productId: products[0]?.id ?? '',
                            qty: 1,
                            unitCost: products[0]?.costPrice ?? 0,
                            receivedQty: 0,
                          },
                        ],
                      },
                    }))
                  }
                >
                  <Plus size={14} /> Add line
                </button>
              </div>

              {purchaseModal.form.lines.map((line) => (
                <div key={line.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 rounded-lg border border-gray-800 bg-gray-900/60 p-2">
                  <div className="md:col-span-5">
                    <select
                      className={classes.input}
                      value={line.productId}
                      onChange={(e) => {
                        const productId = e.target.value;
                        const p = getProduct(productId);
                        setPurchaseModal((prev) => ({
                          ...prev,
                          form: {
                            ...prev.form,
                            lines: prev.form.lines.map((l) =>
                              l.id === line.id ? { ...l, productId, unitCost: p?.costPrice ?? l.unitCost } : l
                            ),
                          },
                        }));
                      }}
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id} className="bg-gray-900">
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="number"
                      className={classes.input}
                      value={line.qty}
                      onChange={(e) =>
                        setPurchaseModal((prev) => ({
                          ...prev,
                          form: {
                            ...prev.form,
                            lines: prev.form.lines.map((l) => (l.id === line.id ? { ...l, qty: Number(e.target.value) } : l)),
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="number"
                      className={classes.input}
                      value={line.unitCost}
                      onChange={(e) =>
                        setPurchaseModal((prev) => ({
                          ...prev,
                          form: {
                            ...prev.form,
                            lines: prev.form.lines.map((l) =>
                              l.id === line.id ? { ...l, unitCost: Number(e.target.value) } : l
                            ),
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center font-mono">{money(line.qty * line.unitCost)}</div>
                  <div className="md:col-span-1">
                    <button
                      type="button"
                      className={classes.btnDanger}
                      onClick={() =>
                        setPurchaseModal((prev) => ({
                          ...prev,
                          form: { ...prev.form, lines: prev.form.lines.filter((l) => l.id !== line.id) },
                        }))
                      }
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 p-3">
              <p className="text-sm">Source</p>
              <select className={classes.input + ' max-w-48'} value={purchaseModal.form.source} onChange={(e) => setPurchaseModal((prev) => ({ ...prev, form: { ...prev.form, source: e.target.value as 'Manual' | 'Auto-Triggered' } }))}>
                <option value="Manual" className="bg-gray-900">Manual</option>
                <option value="Auto-Triggered" className="bg-gray-900">Auto-Triggered</option>
              </select>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 p-3">
              <p>Total Cost</p>
              <p className="font-mono">{money(purchaseTotal)}</p>
            </div>

            <div className="flex justify-end gap-2">
              <button className={classes.btnSecondary} type="button" onClick={() => setPurchaseModal((prev) => ({ ...prev, open: false }))}>
                Cancel
              </button>
              <button className={classes.btnPrimary} type="button" onClick={savePurchase}>
                Save Purchase Order
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {receiveModal.open && (
        <ModalShell title="Receive Products" onClose={() => setReceiveModal({ open: false, orderId: '', rows: {} })}>
          <div className="space-y-3">
            {(purchaseOrders.find((x) => x.id === receiveModal.orderId)?.lines ?? []).map((line) => {
              const p = getProduct(line.productId);
              return (
                <div key={line.id} className="rounded-lg border border-gray-800 p-3">
                  <div className="flex items-center justify-between">
                    <p>{p?.name}</p>
                    <p className="text-xs text-gray-400">Remaining: {qtyText(line.qty - line.receivedQty)}</p>
                  </div>
                  <input
                    type="number"
                    className={`${classes.input} mt-2`}
                    value={receiveModal.rows[line.id] ?? 0}
                    onChange={(e) => setReceiveModal((prev) => ({ ...prev, rows: { ...prev.rows, [line.id]: Number(e.target.value) } }))}
                  />
                </div>
              );
            })}

            <div className="flex justify-end gap-2">
              <button className={classes.btnSecondary} type="button" onClick={() => setReceiveModal({ open: false, orderId: '', rows: {} })}>
                Cancel
              </button>
              <button className={classes.btnPrimary} type="button" onClick={receivePurchase}>
                Post Receipt
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {bomModal.open && (
        <ModalShell title={bomModal.editingId ? 'Edit BoM' : 'Create BoM'} onClose={() => setBomModal((prev) => ({ ...prev, open: false }))}>
          <div className="space-y-3">
            <Field label="Finished Product">
              <select className={classes.input} value={bomModal.form.finishedProductId} onChange={(e) => setBomModal((prev) => ({ ...prev, form: { ...prev.form, finishedProductId: e.target.value } }))}>
                {products.map((p) => (
                  <option key={p.id} value={p.id} className="bg-gray-900">
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Components</p>
                <button
                  type="button"
                  className={classes.btnSecondary}
                  onClick={() =>
                    setBomModal((prev) => ({
                      ...prev,
                      form: {
                        ...prev.form,
                        components: [
                          ...prev.form.components,
                          { id: `BOMC-${Date.now()}`, productId: products[0]?.id ?? '', qty: 1 },
                        ],
                      },
                    }))
                  }
                >
                  <Plus size={14} /> Add Component
                </button>
              </div>

              {bomModal.form.components.map((c) => (
                <div key={c.id} className="grid grid-cols-12 gap-2">
                  <div className="col-span-8">
                    <select
                      className={classes.input}
                      value={c.productId}
                      onChange={(e) =>
                        setBomModal((prev) => ({
                          ...prev,
                          form: {
                            ...prev.form,
                            components: prev.form.components.map((x) =>
                              x.id === c.id ? { ...x, productId: e.target.value } : x
                            ),
                          },
                        }))
                      }
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id} className="bg-gray-900">
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      className={classes.input}
                      value={c.qty}
                      onChange={(e) =>
                        setBomModal((prev) => ({
                          ...prev,
                          form: {
                            ...prev.form,
                            components: prev.form.components.map((x) =>
                              x.id === c.id ? { ...x, qty: Number(e.target.value) } : x
                            ),
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="col-span-1">
                    <button
                      type="button"
                      className={classes.btnDanger}
                      onClick={() =>
                        setBomModal((prev) => ({
                          ...prev,
                          form: { ...prev.form, components: prev.form.components.filter((x) => x.id !== c.id) },
                        }))
                      }
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Operations</p>
                <button
                  type="button"
                  className={classes.btnSecondary}
                  onClick={() =>
                    setBomModal((prev) => ({
                      ...prev,
                      form: {
                        ...prev.form,
                        operations: [
                          ...prev.form.operations,
                          {
                            id: `BOMO-${Date.now()}`,
                            operationName: 'Operation',
                            workCenter: 'Work Center',
                            durationMins: 30,
                          },
                        ],
                      },
                    }))
                  }
                >
                  <Plus size={14} /> Add Operation
                </button>
              </div>

              {bomModal.form.operations.map((o) => (
                <div key={o.id} className="grid grid-cols-12 gap-2">
                  <input className={`${classes.input} col-span-4`} value={o.operationName} onChange={(e) => setBomModal((prev) => ({ ...prev, form: { ...prev.form, operations: prev.form.operations.map((x) => (x.id === o.id ? { ...x, operationName: e.target.value } : x)) } }))} />
                  <input className={`${classes.input} col-span-4`} value={o.workCenter} onChange={(e) => setBomModal((prev) => ({ ...prev, form: { ...prev.form, operations: prev.form.operations.map((x) => (x.id === o.id ? { ...x, workCenter: e.target.value } : x)) } }))} />
                  <input type="number" className={`${classes.input} col-span-3`} value={o.durationMins} onChange={(e) => setBomModal((prev) => ({ ...prev, form: { ...prev.form, operations: prev.form.operations.map((x) => (x.id === o.id ? { ...x, durationMins: Number(e.target.value) } : x)) } }))} />
                  <button type="button" className={`${classes.btnDanger} col-span-1`} onClick={() => setBomModal((prev) => ({ ...prev, form: { ...prev.form, operations: prev.form.operations.filter((x) => x.id !== o.id) } }))}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button className={classes.btnSecondary} type="button" onClick={() => setBomModal((prev) => ({ ...prev, open: false }))}>
                Cancel
              </button>
              <button className={classes.btnPrimary} type="button" onClick={saveBom}>
                Save BoM
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {moModal.open && (
        <ModalShell title="Create Manufacturing Order" onClose={() => setMoModal((prev) => ({ ...prev, open: false }))}>
          <div className="space-y-3">
            <Field label="Finished Product">
              <select
                className={classes.input}
                value={moModal.form.productId}
                onChange={(e) => {
                  const productId = e.target.value;
                  const linked = boms.find((b) => b.finishedProductId === productId);
                  setMoModal((prev) => ({
                    ...prev,
                    form: {
                      ...prev.form,
                      productId,
                      bomId: linked?.id ?? prev.form.bomId,
                    },
                  }));
                }}
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id} className="bg-gray-900">
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Quantity">
              <input type="number" className={classes.input} value={moModal.form.qty} onChange={(e) => setMoModal((prev) => ({ ...prev, form: { ...prev.form, qty: Number(e.target.value) } }))} />
            </Field>
            <Field label="BoM">
              <select className={classes.input} value={moModal.form.bomId} onChange={(e) => setMoModal((prev) => ({ ...prev, form: { ...prev.form, bomId: e.target.value } }))}>
                {boms.map((b) => (
                  <option key={b.id} value={b.id} className="bg-gray-900">
                    {b.id}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Assignee">
              <input className={classes.input} value={moModal.form.assignee} onChange={(e) => setMoModal((prev) => ({ ...prev, form: { ...prev.form, assignee: e.target.value } }))} />
            </Field>
            <Field label="Scheduled Date">
              <input type="date" className={classes.input} value={moModal.form.scheduledDate} onChange={(e) => setMoModal((prev) => ({ ...prev, form: { ...prev.form, scheduledDate: e.target.value } }))} />
            </Field>
            <Field label="Source">
              <select className={classes.input} value={moModal.form.source} onChange={(e) => setMoModal((prev) => ({ ...prev, form: { ...prev.form, source: e.target.value as 'Manual' | 'Auto-Triggered' } }))}>
                <option value="Manual" className="bg-gray-900">Manual</option>
                <option value="Auto-Triggered" className="bg-gray-900">Auto-Triggered</option>
              </select>
            </Field>

            {(() => {
              const b = boms.find((x) => x.id === moModal.form.bomId);
              if (!b) {
                return null;
              }
              return (
                <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-3 space-y-2">
                  <p className="text-sm font-medium">Preview: Components and Work Orders</p>
                  {b.components.map((c) => {
                    const product = getProduct(c.productId);
                    const required = c.qty * moModal.form.qty;
                    const available = product?.onHand ?? 0;
                    return (
                      <div key={c.id} className={`rounded-lg border p-2 text-sm ${available < required ? 'border-rose-500/40 bg-rose-500/10' : 'border-gray-800'}`}>
                        {product?.name ?? '-'}: Required {qtyText(required)} | Available {qtyText(available)}
                      </div>
                    );
                  })}
                  <div className="space-y-1">
                    {b.operations.map((o) => (
                      <div key={o.id} className="rounded-lg border border-gray-800 p-2 text-sm">
                        {o.operationName} · {o.workCenter} · {o.durationMins} mins
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div className="flex justify-end gap-2">
              <button className={classes.btnSecondary} type="button" onClick={() => setMoModal((prev) => ({ ...prev, open: false }))}>
                Cancel
              </button>
              <button className={classes.btnPrimary} type="button" onClick={saveMO}>
                Create MO
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {userModal.open && (
        <ModalShell title={userModal.editingId ? 'Edit User' : 'Add User'} onClose={() => setUserModal((prev) => ({ ...prev, open: false }))}>
          <div className="space-y-3">
            <Field label="Name">
              <input className={classes.input} value={userModal.form.name} onChange={(e) => setUserModal((prev) => ({ ...prev, form: { ...prev.form, name: e.target.value } }))} />
            </Field>
            <Field label="Email">
              <input className={classes.input} value={userModal.form.email} onChange={(e) => setUserModal((prev) => ({ ...prev, form: { ...prev.form, email: e.target.value } }))} />
            </Field>
            <Field label="Role">
              <select
                className={classes.input}
                value={userModal.form.role}
                onChange={(e) => {
                  const role = e.target.value as UserRole;
                  setUserModal((prev) => ({
                    ...prev,
                    form: {
                      ...prev.form,
                      role,
                      access: { ...ROLE_ACCESS[role] },
                    },
                  }));
                }}
              >
                {(Object.keys(ROLE_ACCESS) as UserRole[]).map((r) => (
                  <option key={r} value={r} className="bg-gray-900">
                    {r}
                  </option>
                ))}
              </select>
            </Field>

            <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-3 space-y-2">
              <p className="text-sm font-medium">Module Access</p>
              {(
                [
                  ['dashboard', 'Dashboard'],
                  ['products', 'Products'],
                  ['sales', 'Sales'],
                  ['purchase', 'Purchase'],
                  ['manufacturing', 'Manufacturing'],
                  ['bom', 'BoM'],
                  ['stockLedger', 'Inventory'],
                  ['auditLogs', 'Audit Logs'],
                  ['users', 'User Management'],
                ] as [ViewKey, string][]
              ).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between gap-2">
                  <span className="text-sm">{label}</span>
                  <select
                    className={classes.input + ' max-w-36'}
                    value={userModal.form.access[key]}
                    onChange={(e) =>
                      setUserModal((prev) => ({
                        ...prev,
                        form: {
                          ...prev.form,
                          access: { ...prev.form.access, [key]: e.target.value as AccessLevel },
                        },
                      }))
                    }
                  >
                    <option value="full" className="bg-gray-900">Full</option>
                    <option value="view" className="bg-gray-900">View</option>
                    <option value="none" className="bg-gray-900">None</option>
                  </select>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button className={classes.btnSecondary} type="button" onClick={() => setUserModal((prev) => ({ ...prev, open: false }))}>
                Cancel
              </button>
              <button className={classes.btnPrimary} type="button" onClick={saveUser}>
                Save User
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {confirmDialog.open && (
        <ModalShell title={confirmDialog.title} onClose={() => setConfirmDialog({ open: false, title: '', message: '' })} small>
          <div className="space-y-4">
            <p className="text-sm text-gray-300">{confirmDialog.message}</p>
            <div className="flex justify-end gap-2">
              <button className={classes.btnSecondary} type="button" onClick={() => setConfirmDialog({ open: false, title: '', message: '' })}>
                Cancel
              </button>
              <button
                className={classes.btnDanger}
                type="button"
                onClick={() => {
                  confirmDialog.onConfirm?.();
                  setConfirmDialog({ open: false, title: '', message: '' });
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      <ToastStack toasts={toasts} dismiss={(id) => setToasts((prev) => prev.filter((x) => x.id !== id))} />
    </div>
  );
}

function ToastStack({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-80 max-w-[calc(100vw-2rem)]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-xl border bg-white/95 backdrop-blur p-3 shadow-lg shadow-slate-300/40 transition-all duration-200 ${
            toast.kind === 'success'
              ? 'border-l-4 border-l-emerald-500 border-slate-200'
              : toast.kind === 'error'
                ? 'border-l-4 border-l-rose-500 border-slate-200'
                : toast.kind === 'warning'
                  ? 'border-l-4 border-l-amber-500 border-slate-200'
                  : 'border-l-4 border-l-indigo-500 border-slate-200'
          }`}
        >
          <div className="flex items-start gap-2">
            {toast.kind === 'success' && <Check size={16} className="text-emerald-400 mt-0.5" />}
            {toast.kind === 'error' && <XCircle size={16} className="text-rose-400 mt-0.5" />}
            {toast.kind === 'warning' && <TriangleAlert size={16} className="text-amber-400 mt-0.5" />}
            {toast.kind === 'info' && <Info size={16} className="text-indigo-400 mt-0.5" />}
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900">{toast.title}</p>
              <p className="text-xs text-slate-500">{toast.message}</p>
            </div>
            <button className="ml-auto text-slate-400 hover:text-slate-700" onClick={() => dismiss(toast.id)}>
              <X size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ModalShell({
  title,
  children,
  onClose,
  small = false,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  small?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full ${small ? 'max-w-md' : 'max-w-3xl'} rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-300/30`}>
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h3 className="font-medium text-slate-900">{title}</h3>
          <button type="button" className={classes.btnSecondary} onClick={onClose}>
            <X size={14} />
          </button>
        </div>
        <div className="p-4 max-h-[75vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm text-slate-600">{label}</span>
      {children}
    </label>
  );
}

function TableWrap({ children }: { children: React.ReactNode }) {
  return <div className="overflow-auto rounded-xl border border-slate-200 bg-white">{children}</div>;
}

function MiniStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{title}</p>
      <p className="mt-1 text-sm font-mono text-slate-900">{value}</p>
    </div>
  );
}

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
      <div className="mx-auto mb-2 w-fit text-slate-400">{icon}</div>
      <p className="text-sm font-medium text-slate-700">{message}</p>
      <p className="mt-1 text-xs text-slate-500">Try adjusting your filters or create a new record.</p>
    </div>
  );
}

function SummaryCard({ title, value, tone }: { title: string; value: string; tone: 'emerald' | 'rose' | 'indigo' }) {
  const toneClass =
    tone === 'emerald'
      ? 'border-emerald-200 text-emerald-700'
      : tone === 'rose'
        ? 'border-rose-200 text-rose-700'
        : 'border-indigo-200 text-indigo-700';
  return (
    <div className={`rounded-xl border bg-white p-4 ${toneClass}`}>
      <p className="text-xs text-slate-500">{title}</p>
      <p className="mt-2 text-xl font-mono text-slate-900">{value}</p>
    </div>
  );
}

function StatusStepper({ steps, current }: { steps: string[]; current: string }) {
  const currentIndex = Math.max(0, steps.findIndex((s) => s === current));
  return (
    <div className="flex items-start gap-3">
      {steps.map((step, idx) => {
        const completed = idx < currentIndex;
        const isCurrent = idx === currentIndex;
        return (
          <div key={step} className="flex-1">
            <div className="flex items-center gap-2">
              <span
                className={`h-4 w-4 rounded-full border ${
                  completed
                    ? 'bg-indigo-500 border-indigo-500'
                    : isCurrent
                      ? 'border-indigo-400 ring-2 ring-indigo-500/30 animate-pulse'
                      : 'border-slate-300'
                }`}
              />
              <span className={`text-xs ${isCurrent ? 'text-indigo-700' : 'text-slate-500'}`}>{step}</span>
            </div>
            {idx < steps.length - 1 && <div className="mt-2 h-px bg-slate-200" />}
          </div>
        );
      })}
    </div>
  );
}

export default MiniErpApp;
