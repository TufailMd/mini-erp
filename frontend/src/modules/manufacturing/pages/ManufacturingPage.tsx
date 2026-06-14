import { useState, useEffect } from 'react'
import ErpSidebar from '@/components/layout/ErpSidebar'
import ErpHeader from '@/components/layout/ErpHeader'
import ManufacturingPageHeader from '@/modules/manufacturing/components/ManufacturingPageHeader'
import WorkCenterCards from '@/modules/manufacturing/components/WorkCenterCards'
import KanbanBoard from '@/modules/manufacturing/components/KanbanBoard'
import ManufacturingList from '@/modules/manufacturing/components/ManufacturingList'
import { erpNavItems, erpFooterNavItems } from '@/constants/navigation'
import type { HeaderTab, PageProps, ViewMode, WorkCenter, KanbanColumnData, ManufacturingOrder } from '@/types'
import { toast } from 'react-hot-toast'
import { useErp } from '@/context/ErpContext'

const workCenters: WorkCenter[] = [
  { id: 'wc1', name: 'Assembly Line A', loadPercent: 65, status: 'RUNNING', barColor: 'bg-indigo-600', badgeClass: 'bg-indigo-50 text-indigo-700' },
  { id: 'wc2', name: 'Assembly Line B', loadPercent: 88, status: 'HIGH LOAD', barColor: 'bg-rose-500', badgeClass: 'bg-rose-50 text-rose-700' },
  { id: 'wc3', name: 'QC Station', loadPercent: 25, status: 'IDLE', barColor: 'bg-green-500', badgeClass: 'bg-green-50 text-green-700' },
]

const defaultColumns: Omit<KanbanColumnData, 'orders'>[] = [
  { id: 'draft', title: 'Draft', iconColor: 'bg-slate-400', countBadgeClass: 'bg-slate-100 text-slate-600' },
  { id: 'planned', title: 'Planned', iconColor: 'bg-blue-500', countBadgeClass: 'bg-blue-50 text-blue-600' },
  { id: 'in-progress', title: 'In Progress', iconColor: 'bg-amber-500', countBadgeClass: 'bg-amber-50 text-amber-600' },
]

export default function ManufacturingPage({ activePage, onNavigate }: PageProps) {
  const { manufacturingOrders, products, setActiveOrderId, refreshData } = useErp()
  const [activeTab, setActiveTab] = useState<HeaderTab>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('board')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    refreshData()
    const timer = setTimeout(() => setLoading(false), 600)
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
  const erpOrdersMapped = manufacturingOrders.map((mo): ManufacturingOrder & { progress: number; status: string } => {
    const product = products.find(p => p.id === mo.productId)
    return {
      id: mo.id,
      reference: mo.reference,
      title: `Produce ${product?.name || `Product ${mo.productId}`}`,
      bom: mo.bomId ? `BOM-${mo.bomId.slice(-4).toUpperCase()}` : 'Manual BOM',
      quantity: mo.quantityToProduce,
      progress: mo.status === 'Completed' ? 100 : mo.status === 'Confirmed' ? 0 : 50,
      status: mo.status,
      columnId: (mo.status === 'Draft' ? 'draft' : mo.status === 'Confirmed' ? 'planned' : mo.status === 'Completed' ? 'in-progress' : 'in-progress') as any,
      badge: mo.status,
      badgeClass: mo.status === 'Completed' ? 'bg-green-100 text-green-700' : mo.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
    }
  })

  const filteredColumns = defaultColumns.map((column) => {
    // Determine which status belongs to this column
    const colStatusMap: Record<string, string[]> = {
      'draft': ['Draft'],
      'planned': ['Confirmed'],
      'in-progress': ['In Progress', 'Done', 'Completed', 'Cancelled']
    }
    
    const relevantStatuses = colStatusMap[column.id] || []
    
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
    }
  })

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
