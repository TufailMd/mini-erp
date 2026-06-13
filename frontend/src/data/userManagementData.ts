import type { SystemUser, FieldPermission } from '@/types'

const defaultSalesPermissions: FieldPermission[] = [
  { field: 'Customer', create: 'yes', view: 'yes', edit: 'yes', delete: 'yes' },
  { field: 'Customer Address', create: 'yes', view: 'yes', edit: 'yes', delete: 'yes' },
  { field: 'Sales Person', create: 'yes', view: 'yes', edit: 'yes', delete: 'yes' },
  { field: 'Product', create: 'yes', view: 'yes', edit: 'yes', delete: 'yes' },
  { field: 'Ordered Quantity', create: 'yes', view: 'yes', edit: 'yes', delete: 'yes' },
  { field: 'Delivered Quantity', create: 'yes', view: 'yes', edit: 'yes', delete: 'yes' },
  { field: 'Sales Price', create: 'yes', view: 'yes', edit: 'yes', delete: 'yes' },
  { field: 'Status', create: 'yes', view: 'yes', edit: 'yes', delete: 'no' },
  { field: 'Total', create: 'yes', view: 'yes', edit: 'Recomputed', delete: '' },
  { field: 'Creation Date', create: 'Auto Compute', view: 'yes', edit: 'no', delete: 'no' },
]

const defaultPurchasePermissions: FieldPermission[] = [
  { field: 'Vendor', create: 'yes', view: 'yes', edit: 'yes', delete: 'yes' },
  { field: 'Vendor Address', create: 'yes', view: 'yes', edit: 'yes', delete: 'yes' },
  { field: 'Responsible Person', create: 'yes', view: 'yes', edit: 'yes', delete: 'yes' },
  { field: 'Product', create: 'yes', view: 'yes', edit: 'yes', delete: 'yes' },
  { field: 'Ordered Quantity', create: 'yes', view: 'yes', edit: 'yes', delete: 'yes' },
  { field: 'Received Quantity', create: 'yes', view: 'yes', edit: 'yes', delete: 'yes' },
  { field: 'Cost Price', create: 'yes', view: 'yes', edit: 'yes', delete: 'yes' },
  { field: 'Total', create: 'yes', view: 'yes', edit: 'Auto Recomputed', delete: '' },
  { field: 'Creation Date', create: 'Auto Compute', view: 'yes', edit: 'no', delete: 'no' },
]

// Generating default grids for the missing tabs in the wireframe
const defaultManufacturingPermissions: FieldPermission[] = [
  { field: 'Product', create: 'yes', view: 'yes', edit: 'yes', delete: 'no' },
  { field: 'BOM', create: 'yes', view: 'yes', edit: 'yes', delete: 'no' },
  { field: 'Quantity To Produce', create: 'yes', view: 'yes', edit: 'yes', delete: 'no' },
  { field: 'Responsible', create: 'yes', view: 'yes', edit: 'yes', delete: 'yes' },
  { field: 'Status', create: 'yes', view: 'yes', edit: 'yes', delete: 'no' },
]

const defaultProductPermissions: FieldPermission[] = [
  { field: 'Product Name', create: 'yes', view: 'yes', edit: 'yes', delete: 'yes' },
  { field: 'Product Type', create: 'yes', view: 'yes', edit: 'yes', delete: 'yes' },
  { field: 'Sales Price', create: 'yes', view: 'yes', edit: 'yes', delete: 'no' },
  { field: 'Cost', create: 'yes', view: 'yes', edit: 'yes', delete: 'no' },
  { field: 'Internal Reference', create: 'yes', view: 'yes', edit: 'yes', delete: 'yes' },
]

export const systemUsers: SystemUser[] = [
  {
    id: 'USR-001',
    name: 'Mahesh Gupta',
    address: 'Colaba, Mumbai, 400001',
    mobile: '+918000000000',
    email: 'xyz@xyz.com',
    position: 'Sales Manager',
    permissions: {
      sales: [...defaultSalesPermissions],
      purchase: [...defaultPurchasePermissions],
      manufacturing: [...defaultManufacturingPermissions],
      product: [...defaultProductPermissions],
    }
  },
  {
    id: 'USR-002',
    name: 'Nisary Verma',
    address: 'Andheri, Mumbai, 400053',
    mobile: '+919876543210',
    email: 'nisary@nexus.com',
    position: 'Purchase Executive',
    permissions: {
      sales: [...defaultSalesPermissions],
      purchase: [...defaultPurchasePermissions],
      manufacturing: [...defaultManufacturingPermissions],
      product: [...defaultProductPermissions],
    }
  },
  {
    id: 'USR-003',
    name: 'Sweta Kedia',
    address: 'Bandra, Mumbai, 400050',
    mobile: '+917654321098',
    email: 'sweta@nexus.com',
    position: 'Manufacturing Lead',
    permissions: {
      sales: [...defaultSalesPermissions],
      purchase: [...defaultPurchasePermissions],
      manufacturing: [...defaultManufacturingPermissions],
      product: [...defaultProductPermissions],
    }
  },
  {
    id: 'USR-004',
    name: 'Dinesh Patel',
    address: 'Borivali, Mumbai, 400092',
    mobile: '+918765432109',
    email: 'dinesh@nexus.com',
    position: 'Inventory Manager',
    permissions: {
      sales: [...defaultSalesPermissions],
      purchase: [...defaultPurchasePermissions],
      manufacturing: [...defaultManufacturingPermissions],
      product: [...defaultProductPermissions],
    }
  },
  {
    id: 'USR-005',
    name: 'Trisha K.',
    address: 'Juhu, Mumbai, 400049',
    mobile: '+919988776655',
    email: 'trisha@nexus.com',
    position: 'System Admin',
    permissions: {
      sales: [...defaultSalesPermissions],
      purchase: [...defaultPurchasePermissions],
      manufacturing: [...defaultManufacturingPermissions],
      product: [...defaultProductPermissions],
    }
  }
]
