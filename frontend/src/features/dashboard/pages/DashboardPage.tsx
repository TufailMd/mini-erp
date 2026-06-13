import KpiGrid from "../components/KpiGrid";
import KpiCard from "../components/KpiCard";
import SalesChart from "../components/SalesChart";
import InventoryChart from "../components/InventoryChart";
import ActivityFeed from "../components/ActivityFeed";
import LowStockWidget from "../components/LowStockWidget";
import QuickActions from "../components/QuickActions";

type ActivityItem = {
  title: string;
  detail: string;
  time: string;
};

export default function DashboardPage() {
  const kpis = [
    { title: 'Total Products', value: '125', change: '+4%', description: 'vs last month', trend: 'up' as const },
    { title: 'Inventory Value', value: '₹4,50,000', change: '-2%', description: 'valuation', trend: 'down' as const },
    { title: 'Sales Orders', value: '42', change: '+10%', description: 'new orders', trend: 'up' as const },
    { title: 'Manufacturing Orders', value: '9', change: '0%', description: 'in progress', trend: 'neutral' as const },
  ];

  const activity: ActivityItem[] = [
    { title: 'Sales Order Created', detail: 'SO-001 created by Admin', time: '2m ago' },
    { title: 'Purchase Order Received', detail: 'PO-003 received', time: '20m ago' },
    { title: 'Manufacturing Started', detail: 'MO-005 is now in progress', time: '1h ago' },
    { title: 'Low Stock Alert', detail: 'Dining Table stock below threshold', time: '2h ago' },
  ];

  const lowStock = [
    { name: 'Dining Table', sku: 'DT-001', stock: 2, reorderLevel: 5 },
    { name: 'Wood Panel', sku: 'WP-014', stock: 1, reorderLevel: 10 },
  ];

  const quickActions = [
    { label: '+ Product', description: 'Create a new product' },
    { label: '+ Sales Order', description: 'Start a new sales order' },
    { label: '+ Purchase Order', description: 'Create purchase order' },
    { label: '+ Manufacturing', description: 'Open manufacturing flow' },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Welcome back — here’s an overview of system activity.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <KpiCard key={k.title} title={k.title} value={k.value} change={k.change} description={k.description} trend={k.trend} />
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <SalesChart />
          <InventoryChart />
        </div>

        <div className="space-y-6">
          <ActivityFeed items={activity} />
          <LowStockWidget items={lowStock} />
          <QuickActions actions={quickActions} />
        </div>
      </div>
    </div>
  );
}