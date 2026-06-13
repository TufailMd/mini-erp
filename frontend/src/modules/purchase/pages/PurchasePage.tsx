import { useState, useEffect, useMemo } from 'react'
import ErpSidebar from '@/modules/sales/components/ErpSidebar'
import PurchaseHeader from '@/modules/purchase/components/PurchaseHeader'
import VendorStatCards from '@/modules/purchase/components/VendorStatCards'
import VendorDirectory from '@/modules/purchase/components/VendorDirectory'
import VendorIntelligence from '@/modules/purchase/components/VendorIntelligence'
import VendorActivity from '@/modules/purchase/components/VendorActivity'
import SupplierHeatmap from '@/modules/purchase/components/SupplierHeatmap'
import Pagination from '@/modules/purchase/components/PurchasePagination'
import { toast } from 'react-hot-toast'
import {
  erpNavItems,
  erpFooterNavItems,
} from '@/data/salesData'
import { useErp } from '@/context/ErpContext'
import type { PageProps } from '@/types'
import {
  vendorStatCards,
  vendors,
  vendorMetrics,
  vendorActivity,
} from '@/data/purchaseData'

const PAGE_SIZE = 5

export default function PurchasePage({ activePage, onNavigate }: PageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>('1')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const { purchaseOrders } = useErp()

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  const handleButtonClick = () => {
    toast('Action triggered')
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

  const totalPages = Math.max(1, Math.ceil(purchaseOrders.length / PAGE_SIZE))

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
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={purchaseOrders.length}
                  pageSize={PAGE_SIZE}
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
