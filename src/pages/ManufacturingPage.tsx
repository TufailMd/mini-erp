import { useState, useEffect } from 'react'
import ErpSidebar from '../components/sales/ErpSidebar'
import ErpHeader from '../components/sales/ErpHeader'
import ManufacturingPageHeader from '../components/manufacturing/ManufacturingPageHeader'
import WorkCenterCards from '../components/manufacturing/WorkCenterCards'
import KanbanBoard from '../components/manufacturing/KanbanBoard'
import ManufacturingList from '../components/manufacturing/ManufacturingList'
import {
  erpNavItems,
  erpFooterNavItems,
} from '../data/salesData'
import {
  workCenters,
  kanbanColumns,
  allManufacturingOrders,
} from '../data/manufacturingData'
import type { HeaderTab, PageProps, ViewMode } from '../types'

export default function ManufacturingPage({ activePage, onNavigate }: PageProps) {
  const [activeTab, setActiveTab] = useState<HeaderTab>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('board')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleButtonClick = () => {
    console.log('clicked')
  }

  const handleCreateMO = () => {
    onNavigate('mo-form')
  }

  const handleCardClick = (_orderId: string) => {
    onNavigate('mo-form')
  }

  const filteredColumns = kanbanColumns.map((column) => ({
    ...column,
    orders: column.orders.filter(
      (order) =>
        searchQuery === '' ||
        order.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.bom.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  }))

  const filteredOrders = allManufacturingOrders.filter(
    (order) =>
      searchQuery === '' ||
      order.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.bom.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <ErpSidebar
        navItems={erpNavItems}
        footerItems={erpFooterNavItems}
        activePage={activePage}
        onNavigate={onNavigate}
        onNewRecordClick={handleCreateMO}
      />

      <div className="ml-60 flex min-h-screen flex-col">
        <ErpHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onButtonClick={handleButtonClick}
          searchPlaceholder="Search orders, BOMs..."
        />

        <main className="flex-1 p-6">
          <ManufacturingPageHeader
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onCreateClick={handleCreateMO}
          />

          <WorkCenterCards centers={workCenters} />

          {viewMode === 'board' ? (
            <KanbanBoard
              columns={filteredColumns}
              loading={loading}
              onAddClick={handleCreateMO}
              onCardClick={handleCardClick}
              onMenuClick={handleButtonClick}
            />
          ) : (
            <ManufacturingList
              orders={filteredOrders}
              loading={loading}
              onRowClick={handleCardClick}
            />
          )}
        </main>
      </div>
    </div>
  )
}
