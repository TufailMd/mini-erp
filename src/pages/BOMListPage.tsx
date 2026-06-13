import { useState, useEffect } from 'react'
import ErpSidebar from '../components/sales/ErpSidebar'
import BOMListHeader from '../components/bom/BOMListHeader'
import BOMStatCards from '../components/bom/BOMStatCards'
import BOMFilterBar from '../components/bom/BOMFilterBar'
import BOMTable from '../components/bom/BOMTable'
import BOMPagination from '../components/bom/BOMPagination'
import { erpNavItems, erpFooterNavItems } from '../data/salesData'
import { bomItems, bomStatCards, TOTAL_BOMS, BOM_PAGE_SIZE } from '../data/bomData'
import type { PageProps } from '../types'
import { toast } from 'react-hot-toast'

type FilterType = 'All' | 'Active' | 'Draft' | 'Archived'

export default function BOMListPage({ activePage, onNavigate }: PageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('All')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
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
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredItems.map((item) => item.id))
    }
  }

  const filteredItems = bomItems.filter((item) => {
    const matchesSearch = 
      searchQuery === '' ||
      item.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productCode.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = activeFilter === 'All' || item.status === activeFilter

    return matchesSearch && matchesFilter
  })

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
            selectedIds={selectedIds}
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
