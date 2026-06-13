import { Warehouse, AlertTriangle, DollarSign, ArrowRightLeft } from 'lucide-react';

export const inventoryStatCards = [
  {
    title: 'Total Inventory Value',
    value: '₹1,245,000',
    change: '+3.2%',
    changeType: 'positive',
    icon: DollarSign,
  },
  {
    title: 'Low Stock Alerts',
    value: '18',
    change: '-2',
    changeType: 'positive',
    icon: AlertTriangle,
  },
  {
    title: 'Active Locations',
    value: '4',
    change: '0',
    changeType: 'neutral',
    icon: Warehouse,
  },
  {
    title: 'Pending Transfers',
    value: '7',
    change: '+2',
    changeType: 'negative',
    icon: ArrowRightLeft,
  },
];

export const TOTAL_INVENTORY_ITEMS = 124;
export const INVENTORY_PAGE_SIZE = 10;
