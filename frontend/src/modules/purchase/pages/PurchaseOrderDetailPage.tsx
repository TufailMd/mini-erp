import { useState, useEffect } from 'react'
import ErpSidebar from '@/components/layout/ErpSidebar'
import PODetailHeader from '@/modules/purchase/components/PODetailHeader'
import POBreadcrumbActions from '@/modules/purchase/components/POBreadcrumbActions'
import VendorInfoCards from '@/modules/purchase/components/VendorInfoCards'
import PurchaseItemsTable from '@/modules/purchase/components/PurchaseItemsTable'
import OrderHistory from '@/modules/purchase/components/OrderHistory'
import AdditionalNotes from '@/modules/purchase/components/AdditionalNotes'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { erpNavItems, erpFooterNavItems } from '@/constants/navigation'

import type { HeaderTab, PageProps, PurchaseItem } from '@/types'
import { toast } from 'react-hot-toast'
import { useErp } from '@/context/ErpContext'
import { generateInvoicePDF, type InvoiceData } from '@/utils/pdfGenerator'
import apiClient from '@/api/client'

export default function PurchaseOrderDetailPage({
  onNavigate,
}: PageProps) {
  const { purchaseOrders, activeOrderId, confirmPurchaseOrder, receivePurchaseOrder, products } = useErp()
  
  const activeOrder = purchaseOrders.find(o => o.id === activeOrderId) || purchaseOrders[0]

  // Header state
  const [activeTab, setActiveTab] = useState<HeaderTab>('overview')
  const [searchQuery, setSearchQuery] = useState('')

  // Loading state
  const [loading, setLoading] = useState(true)

  // Order state
  const [orderStatus, setOrderStatus] = useState<string>(
    activeOrder?.status || 'Draft'
  )
  const [items, setItems] = useState<PurchaseItem[]>([])
  const [notes, setNotes] = useState('')
  const [auditLogs, setAuditLogs] = useState<any[]>([])

  useEffect(() => {
    if (activeOrder) {
      setOrderStatus(activeOrder.status)
      const mapped = activeOrder.items?.map((item: any) => {
        const product = products.find(p => p.id === item.productId)
        return {
          id: item.id,
          product: product?.name || `Product ${item.productId}`,
          sku: product?.code || `SKU-${item.productId}`,
          ordered: item.quantity,
          received: item.receivedQuantity || 0,
          uom: 'Units',
          unitPrice: item.price,
          subtotal: item.quantity * item.price,
          iconBg: 'bg-indigo-500'
        }
      }) || []
      setItems(mapped)

      // Fetch audit logs for this record from backend
      const fetchLogs = async () => {
        try {
          const res = await apiClient.get(`/audit-logs?recordId=${activeOrder.id}`)
          setAuditLogs((res as any) || [])
        } catch (e) {
          // ignore
        }
      }
      fetchLogs()
    }
  }, [activeOrder, products])

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleButtonClick = () => {
    toast('Action triggered')
  }

  const handleCancel = async () => {
    try {
      await apiClient.post(`/purchase/${activeOrder.id}/cancel`)
      setOrderStatus('Cancelled')
      toast.error('Order cancelled')
      onNavigate('purchase')
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel')
    }
  }

  const handleConfirm = async () => {
    await confirmPurchaseOrder(activeOrder.id)
  }

  const handleReceive = async () => {
    await receivePurchaseOrder(activeOrder.id)
  }

  const handleDownloadPDF = () => {
    const invoiceData: InvoiceData = {
      reference: activeOrder?.reference || 'Unknown',
      status: activeOrder?.status || 'Draft',
      customerName: (activeOrder as any)?.vendorName || 'Vendor',
      billingAddress: (activeOrder as any)?.vendorAddress || 'Vendor Address',
      orderDate: activeOrder?.createdAt ? new Date(activeOrder.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
      salesPerson: (activeOrder as any)?.responsiblePerson || 'Procurement Dept',
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
    toast.error('Products cannot be added to an active purchase order directly from details.')
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
              onReceive={handleReceive}
            />
            
            <div className="flex gap-6">
              {/* Main content area */}
              <div className="min-w-0 flex-1 space-y-5">
                <VendorInfoCards
                  vendorName={(activeOrder as any)?.vendorName || 'Vendor'}
                  vendorCode="VEN-DB"
                  vendorAddress={(activeOrder as any)?.vendorAddress || 'Vendor Address'}
                  responsiblePerson={(activeOrder as any)?.responsiblePerson || 'Purchase Rep'}
                  responsibleRole="Purchase Representative"
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
                  history={auditLogs.map((log: any, idx: number) => ({
                    id: log._id || String(idx),
                    type: log.action === 'Created' ? 'created' : 'updated',
                    label: log.action,
                    description: log.fieldChanged ? `Changed ${log.fieldChanged} from "${log.oldValue}" to "${log.newValue}"` : `Order was ${log.action.toLowerCase()}`,
                    date: new Date(log.createdAt).toLocaleDateString()
                  }))} 
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
