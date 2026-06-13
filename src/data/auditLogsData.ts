import type { AuditLogEntry } from '../types'

export const auditLogs: AuditLogEntry[] = [
  { id: '1', dateTime: '26 May 2026, 11:42 AM', user: 'Amit Sharma', module: 'Sales', recordType: 'Product', recordId: 'PROD-0034', action: 'Updated', fieldChanged: 'Sales Price', oldValue: '₹120.00', newValue: '₹135.00' },
  { id: '2', dateTime: '26 May 2026, 11:15 AM', user: 'Neha Verma', module: 'Sales', recordType: 'Item', recordId: 'ITEM-0102', action: 'Updated', fieldChanged: 'Cost Price', oldValue: '₹80.00', newValue: '₹85.00' },
  { id: '3', dateTime: '26 May 2026, 10:55 AM', user: 'Ravi Patel', module: 'Purchase', recordType: 'Purchase Order', recordId: 'PO-2026-087', action: 'Created', fieldChanged: '-', oldValue: '-', newValue: '-' },
  { id: '4', dateTime: '26 May 2026, 10:20 AM', user: 'Amit Sharma', module: 'Purchase', recordType: 'Item', recordId: 'ITEM-0456', action: 'Updated', fieldChanged: 'Cost Price', oldValue: '₹45.00', newValue: '₹50.00' },
  { id: '5', dateTime: '26 May 2026, 09:48 AM', user: 'Meera Singh', module: 'Manufacturing', recordType: 'BOM', recordId: 'BOM-2026-015', action: 'Created', fieldChanged: '-', oldValue: '-', newValue: '-' },
  { id: '6', dateTime: '26 May 2026, 09:30 AM', user: 'Ravi Patel', module: 'Sales', recordType: 'Item', recordId: 'ITEM-0102', action: 'Updated', fieldChanged: 'Sales Price', oldValue: '₹110.00', newValue: '₹120.00' },
  { id: '7', dateTime: '26 May 2026, 09:10 AM', user: 'Neha Verma', module: 'Purchase', recordType: 'Product', recordId: 'PROD-0021', action: 'Deleted', fieldChanged: '-', oldValue: '-', newValue: '-' },
  { id: '8', dateTime: '26 May 2026, 08:45 AM', user: 'Amit Sharma', module: 'Manufacturing', recordType: 'Manufacturing Order', recordId: 'MO-2026-022', action: 'Updated', fieldChanged: 'Demand', oldValue: '80', newValue: '100' },
  { id: '9', dateTime: '26 May 2026, 08:30 AM', user: 'Meera Singh', module: 'Manufacturing', recordType: 'Material Consumption', recordId: 'MC-2026-055', action: 'Updated', fieldChanged: 'Consumed Qty', oldValue: '45', newValue: '50' },
]

export const auditStats = {
  total: 1265,
  created: 356,
  updated: 789,
  deleted: 120
}

export const filterOptions = {
  users: ['All Users', 'Amit Sharma', 'Neha Verma', 'Ravi Patel', 'Meera Singh'],
  modules: ['All Modules', 'Sales', 'Purchase', 'Manufacturing', 'Inventory'],
  actions: ['All Actions', 'Created', 'Updated', 'Deleted']
}
