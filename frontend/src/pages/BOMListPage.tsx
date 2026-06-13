import { useState, useEffect, useMemo } from 'react'
import ErpSidebar from '@/modules/sales/components/ErpSidebar'
import BOMListHeader from '@/modules/manufacturing/components/bom/BOMListHeader'
import BOMStatCards from '@/modules/manufacturing/components/bom/BOMStatCards'
import BOMFilterBar from '@/modules/manufacturing/components/bom/BOMFilterBar'
import BOMTable from '@/modules/manufacturing/components/bom/BOMTable'
import BOMPagination from '@/modules/manufacturing/components/bom/BOMPagination'
import { erpNavItems, erpFooterNavItems } from '@/data/salesData'
import { bomStatCards, TOTAL_BOMS, BOM_PAGE_SIZE } from '@/data/bomData'
import type { PageProps } from '@/types'
import { toast } from 'react-hot-toast'
import { useErp } from '@/context/ErpContext'

type FilterType = 'All' | 'Active' | 'Draft' | 'Archived'

export default function BOMListPage({ activePage, onNavigate }: PageProps) {
  const { boms } = useErp()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('All')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  const handleCreateBOM = () => {
    onNavigate('bom-detail')
  }

  const handleBomClick = (id: string) => {
    toast.success(`Loading BOM ${id}`)
    onNavigate('bom-detail')
  }

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleToggleSelectAll = () => {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredItems.map((item: any) => item.id)))
    }
  }

  // Map backend boms to UI format
  const mappedBoms = boms.map(b => ({
    id: b.id,
    reference: b.id,
    product: b.productId,
    productCode: b.productId,
    quantity: 1,
    uom: 'Unit',
    componentCount: b.components.length,
    operationCount: 0,
    status: 'Active' as const,
    lastModified: 'Today',
    createdBy: 'System',
    bomType: 'Manufacture' as const,
    company: 'Nexus',
    routingStatus: 'Active',
    costShape: []
  }))

  const filteredItems = useMemo(() => {
    return mappedBoms.filter((item) => {
      const matchesSearch = 
        searchQuery === '' ||
        item.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.product.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesFilter = activeFilter === 'All' || item.status === activeFilter

      return matchesSearch && matchesFilter
    })
  }, [searchQuery, boms, activeFilter])

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <ErpSidebar
        navItems={erpNavItems}
        footerItems={erpFooterNavItems}
        activePage={activePage}
        onNavigate={onNavigate}
        onNewRecordClick={handleCreateBOM}
      />

      <div className="ml-60 flex min-h-screen flex-col">
        <BOMListHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCreateBOM={handleCreateBOM}
          onButtonClick={() => {}}
        />

        <main className="flex-1 p-6">
          <BOMStatCards cards={bomStatCards} />
          
          <BOMFilterBar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onExport={() => {}}
          />

          <BOMTable
            items={filteredItems}
            loading={loading}
            selectedIds={Array.from(selectedIds)}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onBomClick={handleBomClick}
          />

          {!loading && filteredItems.length > 0 && (
            <BOMPagination total={TOTAL_BOMS} pageSize={BOM_PAGE_SIZE} />
          )}

          {!loading && filteredItems.length === 0 && (
            <div className="mt-8 text-center text-slate-500">
              No bills of materials found matching your criteria.
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
