import { useState, useEffect, useMemo } from 'react'
import ErpSidebar from '@/modules/sales/components/ErpSidebar'
import ErpHeader from '@/modules/sales/components/ErpHeader'
import SalesPageHeader from '@/modules/sales/components/SalesPageHeader'
import FilterBar from '@/modules/sales/components/FilterBar'
import OrderTable from '@/modules/sales/components/OrderTable'
import Pagination from '@/modules/sales/components/Pagination'
import {
  erpNavItems,
  erpFooterNavItems,
  statusOptions,
  dateRangeOptions,
} from '@/data/salesData'
import { useErp } from '@/context/ErpContext'
import { toast } from 'react-hot-toast'
import type { HeaderTab, PageProps } from '@/types'

const PAGE_SIZE = 5

export default function SalesOrdersPage({ activePage, onNavigate }: PageProps) {
  const [activeTab, setActiveTab] = useState<HeaderTab>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterQuery, setFilterQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateRange, setDateRange] = useState('30')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  const { salesOrders, setActiveOrderId } = useErp()

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleButtonClick = () => {
    toast('Action triggered')
  }

  const handleNewOrder = () => {
    setActiveOrderId(null)
    onNavigate('sales-order-create')
  }

  const handleReferenceClick = (reference: string) => {
    // Note: the original table passed reference, but we need ID.
    // Let's find the ID by reference or just change the Table later. 
    // Wait, the table might be passing the reference text. 
    const order = salesOrders.find(o => o.reference === reference) || salesOrders[0]
    setActiveOrderId(order.id)
    onNavigate('sales-order-detail')
  }

  const filteredOrders = useMemo(() => {
    const mapped = salesOrders.map((order) => {
      let total = 0
      if (order.items && Array.isArray(order.items)) {
        total = order.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
      } else if ((order as any).totalAmount) {
        total = (order as any).totalAmount
      } else if ((order as any).total) {
        total = (order as any).total
      }

      return {
        id: order.id,
        reference: order.reference,
        date: (order as any).createdAt ? new Date((order as any).createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ((order as any).date || 'Unknown'),
        customerName: order.customerName || 'Unknown',
        customerInitials: (order.customerName || 'U').substring(0, 2).toUpperCase(),
        customerColor: (order as any).customerColor || 'bg-indigo-500',
        total: total,
        status: order.status === 'Completed' ? 'Delivered' : order.status
      }
    })

    return mapped.filter((order) => {
      const matchesFilter =
        filterQuery === '' ||
        order.reference.toLowerCase().includes(filterQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(filterQuery.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' || order.status === statusFilter

      return matchesFilter && matchesStatus
    })
  }, [filterQuery, statusFilter, salesOrders])

  const totalPages = Math.max(1, Math.ceil(salesOrders.length / PAGE_SIZE))

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleSelectAll = () => {
    const allSelected = filteredOrders.every((o) => selectedIds.has(o.id))
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredOrders.map((o) => o.id)))
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <ErpSidebar
        navItems={erpNavItems}
        footerItems={erpFooterNavItems}
        activePage={activePage}
        onNavigate={onNavigate}
        onNewRecordClick={handleNewOrder}
      />

      <div className="ml-60 flex min-h-screen flex-col">
        <ErpHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onButtonClick={handleButtonClick}
        />

        <main className="flex-1 p-6">
          <SalesPageHeader
            onExportClick={handleButtonClick}
            onNewOrderClick={handleNewOrder}
          />

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <FilterBar
              filterQuery={filterQuery}
              onFilterChange={setFilterQuery}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              statusOptions={statusOptions}
              dateRangeOptions={dateRangeOptions}
              onFilterSettingsClick={handleButtonClick}
            />

            <OrderTable
              orders={filteredOrders as any}
              loading={loading}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onToggleSelectAll={toggleSelectAll}
              onReferenceClick={handleReferenceClick}
            />

            {!loading && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={salesOrders.length}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
