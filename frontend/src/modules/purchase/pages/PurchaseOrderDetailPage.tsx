import { useState, useEffect } from 'react'
import ErpSidebar from '@/modules/sales/components/ErpSidebar'
import PODetailHeader from '@/modules/purchase/components/PODetailHeader'
import POBreadcrumbActions from '@/modules/purchase/components/POBreadcrumbActions'
import VendorInfoCards from '@/modules/purchase/components/VendorInfoCards'
import PurchaseItemsTable from '@/modules/purchase/components/PurchaseItemsTable'
import OrderHistory from '@/modules/purchase/components/OrderHistory'
import AdditionalNotes from '@/modules/purchase/components/AdditionalNotes'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { erpNavItems, erpFooterNavItems } from '@/data/salesData'
import { purchaseOrderData } from '@/data/purchaseOrderData'
import type { HeaderTab, PageProps, PurchaseItem } from '@/types'
import { toast } from 'react-hot-toast'
import { useErp } from '@/context/ErpContext'
import { generateInvoicePDF, type InvoiceData } from '@/utils/pdfGenerator'

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
    (activeOrder?.status as any) || 'Draft'
  )
  const [items, setItems] = useState<PurchaseItem[]>(
    activeOrder?.items?.map(item => ({
      id: item.id,
      product: `Product ${item.productId}`,
      sku: `SKU-${item.productId}`,
      ordered: item.quantity,
      received: activeOrder?.status === 'Completed' ? item.quantity : 0,
      uom: 'Units',
      unitPrice: item.price,
      subtotal: item.quantity * item.price,
      iconBg: 'bg-indigo-500'
    })) || []
  )
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (activeOrder) {
      setOrderStatus(activeOrder.status as any)
      setItems(activeOrder.items?.map(item => ({
        id: item.id,
        product: `Product ${item.productId}`,
        sku: `SKU-${item.productId}`,
        ordered: item.quantity,
        received: activeOrder.status === 'Completed' ? item.quantity : 0,
        uom: 'Units',
        unitPrice: item.price,
        subtotal: item.quantity * item.price,
        iconBg: 'bg-indigo-500'
      })) || [])
    }
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

  const handleDownloadPDF = () => {
    const invoiceData: InvoiceData = {
      reference: activeOrder?.reference || 'Unknown',
      status: activeOrder?.status || 'Draft',
      customerName: activeOrder?.vendorId || 'Vendor',
      billingAddress: 'Vendor Address',
      orderDate: activeOrder?.createdAt ? new Date(activeOrder.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
      salesPerson: 'Procurement Dept',
      lineItems: items.map(li => ({
        product: li.product,
        quantity: li.ordered,
        price: li.unitPrice,
        total: li.subtotal
      })),
      subtotal: activeOrder?.totalAmount || 0,
      taxAmount: 0,
      total: activeOrder?.totalAmount || 0
    }
    
    generateInvoicePDF(invoiceData)
    toast.success('PO PDF Downloaded')
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
                  reference={activeOrder?.reference || 'Unknown'} 
                  status={orderStatus}
                  onDownloadPDF={handleDownloadPDF}
                  onBackToPurchase={() => onNavigate('purchase')}
                  onCancel={handleCancel}
                  onConfirm={handleConfirm}
                />
                
                <div className="flex gap-6">
                  {/* Main content area */}
                  <div className="min-w-0 flex-1 space-y-5">
                    <VendorInfoCards
                  vendorName={activeOrder?.vendorId || 'Mock Vendor'}
                  vendorCode="VEN-001"
                  vendorAddress="123 Industrial Way"
                  responsiblePerson="Mahesh Gupta"
                  responsibleRole="Purchase Manager"
                />
                
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-800">Products ({items.length})</h2>
                      <p className="text-sm text-slate-500">Items ordered from vendor</p>
                    </div>
                  </div>
                  
                  <PurchaseItemsTable
                    items={items}
                    untaxedAmount={activeOrder?.totalAmount || 0}
                    taxRate={0}
                    taxAmount={0}
                    total={activeOrder?.totalAmount || 0}
                    onAddProduct={handleAddProduct}
                  />
                  
                </div>

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
