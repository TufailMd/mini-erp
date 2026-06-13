import type { ModuleMetrics, UserProfile } from '../types'

export const userProfileData: UserProfile = {
  name: 'Mahesh Gupta',
  address: 'Colaba, Mumbai, 400001',
  mobile: '+918000000000',
  email: 'xyz@xyz.com',
  position: 'Sales Manager'
}

export const saleOrdersMetrics: ModuleMetrics = {
  title: 'Sale Orders',
  all: [
    { label: 'Draft', count: 2 },
    { label: 'Confirmed', count: 7 },
    { label: 'Partially Delivered', count: 1 },
    { label: 'Delivered', count: 11 },
    { label: 'Late', count: 11, isActive: true }
  ],
  my: [
    { label: 'Confirmed', count: 7 },
    { label: 'Draft', count: 1 },
    { label: 'Delivered', count: 5 }
  ]
}

export const purchaseOrdersMetrics: ModuleMetrics = {
  title: 'Purchase Orders',
  all: [
    { label: 'Draft', count: 2 },
    { label: 'Confirmed', count: 3 },
    { label: 'Partially Received', count: 1 },
    { label: 'Received', count: 11 },
    { label: 'Late', count: 11, isActive: true }
  ],
  my: [
    { label: 'Confirmed', count: 7 },
    { label: 'Draft', count: 1 },
    { label: 'Received', count: 5 }
  ]
}

export const manufacturingOrdersMetrics: ModuleMetrics = {
  title: 'Manufacturing Orders',
  all: [
    { label: 'Draft', count: 2 },
    { label: 'Confirmed', count: 7 },
    { label: 'In-progress', count: 1 },
    { label: 'To Close', count: 5 },
    { label: 'Done', count: 11, isActive: true }
  ],
  my: [
    { label: 'Confirmed', count: 4 },
    { label: 'In-progress', count: 1 },
    { label: 'Done', count: 5 }
  ]
}
