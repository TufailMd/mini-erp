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
  kanbanColumns as defaultColumns,
} from '../data/manufacturingData'
import type { HeaderTab, PageProps, ViewMode } from '../types'
import { toast } from 'react-hot-toast'
import { useErp } from '../context/ErpContext'

export default function ManufacturingPage({ activePage, onNavigate }: PageProps) {
  const { manufacturingOrders, setActiveOrderId } = useErp()
  const [activeTab, setActiveTab] = useState<HeaderTab>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('board')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleButtonClick = () => {
    toast('Action triggered')
  }

  const handleCreateMO = () => {
    setActiveOrderId(null)
    onNavigate('mo-form')
  }

  const handleCardClick = (orderId: string) => {
    setActiveOrderId(orderId)
    onNavigate('mo-form')
  }

  // Map ErpManufacturingOrder to UI Order
  const erpOrdersMapped = manufacturingOrders.map(mo => ({
    id: mo.id,
    reference: mo.reference,
    title: `Produce Product ${mo.productId}`,
    bom: `BOM-${mo.bomId || 'Manual'}`,
    quantity: mo.quantityToProduce,
    progress: mo.status === 'Completed' ? 100 : mo.status === 'Partially Processed' ? 50 : 0,
    status: mo.status,
    priority: 'Normal' as const,
    assignee: 'MG'
  }))

  const filteredColumns = defaultColumns.map((column) => {
    // Determine which status belongs to this column
    const colStatusMap: Record<string, string[]> = {
      'Draft': ['Draft'],
      'Confirmed': ['Confirmed'],
      'In Progress': ['Partially Processed'],
      'To Close': [], // Not explicitly mapped in ErpContext yet
      'Done': ['Completed']
    }
    
    const relevantStatuses = colStatusMap[column.title] || []
    
    return {
    ...column,
    orders: erpOrdersMapped.filter(
      (order) =>
        relevantStatuses.includes(order.status) &&
        (searchQuery === '' ||
        order.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.bom.toLowerCase().includes(searchQuery.toLowerCase())),
    ),
  }})

  const filteredOrders = erpOrdersMapped.filter(
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
