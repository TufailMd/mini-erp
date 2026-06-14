import type { StatusOption, DateRangeOption } from '@/types'

export const statusOptions: StatusOption[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'Confirmed', label: 'Confirmed' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Partially Delivered', label: 'Partially Delivered' },
  { value: 'Delivered', label: 'Delivered' },
  { value: 'Cancelled', label: 'Cancelled' },
]

export const dateRangeOptions: DateRangeOption[] = [
  { value: '7', label: 'Last 7 Days' },
  { value: '30', label: 'Last 30 Days' },
  { value: '90', label: 'Last 90 Days' },
  { value: '365', label: 'Last Year' },
]
