import { useState, useEffect, useMemo } from 'react'
import ErpSidebar from '../components/sales/ErpSidebar'
import PurchaseHeader from '../components/purchase/PurchaseHeader'
import VendorStatCards from '../components/purchase/VendorStatCards'
import VendorDirectory from '../components/purchase/VendorDirectory'
import VendorIntelligence from '../components/purchase/VendorIntelligence'
import VendorActivity from '../components/purchase/VendorActivity'
import SupplierHeatmap from '../components/purchase/SupplierHeatmap'
import PurchasePagination from '../components/purchase/PurchasePagination'
import {
  erpNavItems,
  erpFooterNavItems,
} from '../data/salesData'
import {
  vendorStatCards,
  vendors,
  vendorMetrics,
  vendorActivity,
  TOTAL_VENDORS,
  VENDORS_PAGE_SIZE,
} from '../data/purchaseData'
import type { PageProps } from '../types'

export default function PurchasePage({ activePage, onNavigate }: PageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>('1')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  const handleButtonClick = () => {
    console.log('clicked')
  }

  const handleNewRecord = () => {
    onNavigate('purchase-order-detail')
  }

  const handleIssuePO = () => {
    onNavigate('purchase-order-detail')
  }

  const filteredVendors = useMemo(() => {
    if (searchQuery === '') return vendors
    const query = searchQuery.toLowerCase()
    return vendors.filter(
      (v) =>
        v.name.toLowerCase().includes(query) ||
        v.code.toLowerCase().includes(query) ||
        v.contactPerson.toLowerCase().includes(query) ||
        v.category.toLowerCase().includes(query),
    )
  }, [searchQuery])

  const selectedVendor = vendors.find((v) => v.id === selectedVendorId)
  const vendorDisplayName = selectedVendor?.name ?? 'Swift Industries Ltd.'

  const totalPages = Math.max(
    1,
    Math.ceil(TOTAL_VENDORS / VENDORS_PAGE_SIZE),
  )

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <ErpSidebar
        navItems={erpNavItems}
        footerItems={erpFooterNavItems}
        activePage={activePage}
        onNavigate={onNavigate}
        onNewRecordClick={handleNewRecord}
        userName="Mahesh Gupta"
        userRole="Purchase Manager"
        userInitials="MG"
      />

      <div className="ml-60 flex min-h-screen flex-col">
        <PurchaseHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onButtonClick={handleButtonClick}
        />

        <main className="flex-1 p-6">
          <VendorStatCards cards={vendorStatCards} />

          {/* Main content: Directory + Intelligence */}
          <div className="mb-6 flex gap-6">
            <div className="flex flex-[3] flex-col">
              <VendorDirectory
                vendors={filteredVendors}
                selectedVendorId={selectedVendorId}
                onVendorClick={setSelectedVendorId}
                loading={loading}
              />
              {!loading && (
                <PurchasePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={TOTAL_VENDORS}
                  pageSize={VENDORS_PAGE_SIZE}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>

            <VendorIntelligence
              vendorName={vendorDisplayName}
              metrics={vendorMetrics}
              onIssuePO={handleIssuePO}
            />
          </div>

          {/* Bottom row: Activity + Heatmap */}
          <div className="flex gap-6">
            <VendorActivity activities={vendorActivity} />
            <SupplierHeatmap />
          </div>
        </main>
      </div>
    </div>
  )
}
