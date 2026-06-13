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
import { toast } from 'react-hot-toast'
import { useErp } from '../context/ErpContext'

export default function PurchaseOrderDetailPage({
  onNavigate,
}: PageProps) {
  const { purchaseOrders, activeOrderId, confirmPurchaseOrder } = useErp()
  
  const activeOrder = purchaseOrders.find(o => o.id === activeOrderId) || purchaseOrders[0]

  // Header state
  const [activeTab, setActiveTab] = useState<HeaderTab>('overview')
  const [searchQuery, setSearchQuery] = useState('')

  // Loading state
  const [loading, setLoading] = useState(true)

  // Order state
  const [orderStatus, setOrderStatus] = useState<'Draft' | 'Confirmed' | 'Cancelled'>(
    activeOrder.status as any
  )
  const [items, setItems] = useState<PurchaseItem[]>(
    activeOrder.items.map(item => ({
      id: item.id,
      product: `Product ${item.productId}`,
      sku: `SKU-${item.productId}`,
      ordered: item.quantity,
      received: activeOrder.status === 'Completed' ? item.quantity : 0,
      uom: 'Units',
      unitPrice: item.price,
      subtotal: item.quantity * item.price,
      iconBg: 'bg-indigo-500'
    }))
  )
  const [notes, setNotes] = useState('')

  useEffect(() => {
    setOrderStatus(activeOrder.status as any)
    setItems(activeOrder.items.map(item => ({
      id: item.id,
      product: `Product ${item.productId}`,
      sku: `SKU-${item.productId}`,
      ordered: item.quantity,
      received: activeOrder.status === 'Completed' ? item.quantity : 0,
      uom: 'Units',
      unitPrice: item.price,
      subtotal: item.quantity * item.price,
      iconBg: 'bg-indigo-500'
    })))
  }, [activeOrder])

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  const handleButtonClick = () => {
    toast('Action triggered')
  }

  const handleCancel = () => {
    setOrderStatus('Cancelled')
    toast.error('Order cancelled')
  }

  const handleConfirm = () => {
    confirmPurchaseOrder(activeOrder.id)
  }

  const handlePrint = () => {
    toast('Print order')
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
              reference={activeOrder.reference}
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
                  vendorName={activeOrder.vendorId} // Mock
                  vendorCode="VEN-001"
                  vendorAddress="123 Industrial Way"
                  responsiblePerson="Mahesh Gupta"
                  responsibleRole="Purchase Manager"
                />

                <PurchaseItemsTable
                  items={items}
                  untaxedAmount={activeOrder.totalAmount}
                  taxRate={0}
                  taxAmount={0}
                  total={activeOrder.totalAmount}
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
