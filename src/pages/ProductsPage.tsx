import { useState, useEffect, useMemo } from 'react'
import { toast } from 'react-hot-toast'
import ErpSidebar from '../components/sales/ErpSidebar'
import ProductsHeader from '../components/products/ProductsHeader'
import ProductStatCards from '../components/products/ProductStatCards'
import ProductFilterBar from '../components/products/ProductFilterBar'
import ProductTable from '../components/products/ProductTable'
import ProductPagination from '../components/products/ProductPagination'
import {
  erpNavItems,
  erpFooterNavItems,
} from '../data/salesData'
import {
  productStatCards,
  defaultFilters,
  products,
  TOTAL_PRODUCTS,
  PRODUCTS_PAGE_SIZE,
} from '../data/productsData'
import type { PageProps, ActiveFilter } from '../types'
import { useErp } from '../context/ErpContext'

export default function ProductsPage({ activePage, onNavigate }: PageProps) {
  const { products: erpProducts } = useErp()
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<ActiveFilter[]>(defaultFilters)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  const handleButtonClick = () => {
    toast('Action triggered')
  }

  const handleNewProduct = () => {
    onNavigate('product-detail')
  }

  const handleProductClick = (_productName: string) => {
    onNavigate('product-detail')
  }

  const handleRemoveFilter = (filterId: string) => {
    setFilters((prev) => prev.filter((f) => f.id !== filterId))
  }

  const handleClearAllFilters = () => {
    setFilters([])
  }

  const filteredProducts = useMemo(() => {
    // Map ErpProducts to UI products structure
    const mapped = erpProducts.map(p => ({
      id: p.id,
      name: p.name,
      sku: p.code,
      category: p.id.includes('PRD') ? 'Finished Goods' : 'Components',
      price: p.salesPrice,
      cost: p.costPrice,
      onHand: p.onHandQty,
      status: p.onHandQty > 10 ? 'In Stock' : p.onHandQty > 0 ? 'Low Stock' : 'Out of Stock'
    }))

    if (searchQuery === '') return mapped
    const query = searchQuery.toLowerCase()
    return mapped.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query),
    )
  }, [searchQuery, erpProducts])

  const totalPages = Math.max(
    1,
    Math.ceil(TOTAL_PRODUCTS / PRODUCTS_PAGE_SIZE),
  )

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    const allSelected = filteredProducts.every((p) => selectedIds.has(p.id))
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredProducts.map((p) => p.id)))
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <ErpSidebar
        navItems={erpNavItems}
        footerItems={erpFooterNavItems}
        activePage={activePage}
        onNavigate={onNavigate}
        onNewRecordClick={handleNewProduct}
        userName="John Doe"
        userRole="Administrator"
        userInitials="JD"
      />

      <div className="ml-60 flex min-h-screen flex-col">
        <ProductsHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewProductClick={handleNewProduct}
          onButtonClick={handleButtonClick}
        />

        <main className="flex-1 p-6">
          <ProductStatCards cards={productStatCards} />

          <ProductFilterBar
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAllFilters}
            onExport={handleButtonClick}
            onPrint={handleButtonClick}
          />

          <ProductTable
            products={filteredProducts}
            loading={loading}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
            onProductClick={handleProductClick}
          />

          {!loading && (
            <ProductPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={TOTAL_PRODUCTS}
              pageSize={PRODUCTS_PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          )}
        </main>
      </div>
    </div>
  )
}
