import { useState, useEffect } from 'react'
import ErpSidebar from '../components/sales/ErpSidebar'
import PODetailHeader from '../components/purchase/PODetailHeader'
import POBreadcrumbActions from '../components/purchase/POBreadcrumbActions'
import VendorInfoCards from '../components/purchase/VendorInfoCards'
import PurchaseItemsTable from '../components/purchase/PurchaseItemsTable'
import OrderHistory from '../components/purchase/OrderHistory'
import AdditionalNotes from '../components/purchase/AdditionalNotes'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import { erpNavItems, erpFooterNavItems } from '../data/salesData'
import { purchaseOrderData } from '../data/purchaseOrderData'
import type { HeaderTab, PageProps, PurchaseItem } from '../types'

export default function PurchaseOrderDetailPage({
  activePage,
  onNavigate,
}: PageProps) {
  // Header state
  const [activeTab, setActiveTab] = useState<HeaderTab>('overview')
  const [searchQuery, setSearchQuery] = useState('')

  // Loading state
  const [loading, setLoading] = useState(true)

  // Order state
  const [orderStatus, setOrderStatus] = useState<'Draft' | 'Confirmed' | 'Cancelled'>(
    purchaseOrderData.status
  )
  const [items, setItems] = useState<PurchaseItem[]>(purchaseOrderData.items)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  const handleButtonClick = () => {
    console.log('clicked')
  }

  const handleCancel = () => {
    setOrderStatus('Cancelled')
    console.log('Order cancelled')
  }

  const handleConfirm = () => {
    setOrderStatus('Confirmed')
    console.log('Order confirmed')
  }

  const handlePrint = () => {
    console.log('Print order')
  }

  const handleAddProduct = () => {
    const newItem: PurchaseItem = {
      id: String(items.length + 1),
      product: 'New Product',
      sku: 'SKU-000',
      ordered: 0,
      received: 0,
      uom: 'Units',
      unitPrice: 0,
      subtotal: 0,
      iconBg: 'bg-slate-500',
    }
    setItems([...items, newItem])
    console.log('Product added')
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <ErpSidebar
        navItems={erpNavItems}
        footerItems={erpFooterNavItems}
        activePage="purchase"
        onNavigate={onNavigate}
        onNewRecordClick={handleButtonClick}
      />

      <div className="ml-60 flex min-h-screen flex-col">
        <PODetailHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {loading ? (
          <LoadingSpinner className="mt-32" />
        ) : (
          <main className="flex-1 p-6">
            <POBreadcrumbActions
              reference={purchaseOrderData.reference}
              status={orderStatus}
              onBackToPurchase={() => onNavigate('purchase')}
              onCancel={handleCancel}
              onPrint={handlePrint}
              onConfirm={handleConfirm}
            />

            <div className="flex gap-6">
              {/* Main content area */}
              <div className="min-w-0 flex-1 space-y-5">
                <VendorInfoCards
                  vendorName={purchaseOrderData.vendorName}
                  vendorCode={purchaseOrderData.vendorCode}
                  vendorAddress={purchaseOrderData.vendorAddress}
                  responsiblePerson={purchaseOrderData.responsiblePerson}
                  responsibleRole={purchaseOrderData.responsibleRole}
                />

                <PurchaseItemsTable
                  items={items}
                  untaxedAmount={purchaseOrderData.untaxedAmount}
                  taxRate={purchaseOrderData.taxRate}
                  taxAmount={purchaseOrderData.taxAmount}
                  total={purchaseOrderData.total}
                  onAddProduct={handleAddProduct}
                />

                <AdditionalNotes
                  notes={notes}
                  onNotesChange={setNotes}
                />
              </div>

              {/* Right sidebar */}
              <div className="w-72 shrink-0">
                <OrderHistory 
                  history={purchaseOrderData.history} 
                  onViewLogs={() => onNavigate('audit-logs')}
                />
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  )
}
