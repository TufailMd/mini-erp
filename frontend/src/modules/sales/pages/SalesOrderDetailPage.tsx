import { useState, useEffect } from 'react'
import ErpSidebar from '@/components/layout/ErpSidebar'
import ErpHeader from '@/components/layout/ErpHeader'
import OrderDetailHeader from '@/modules/sales/components/OrderDetailHeader'
import CustomerInfoSection from '@/modules/sales/components/CustomerInfoSection'
import OrderDetailsSection from '@/modules/sales/components/OrderDetailsSection'
import LineItemsTable from '@/modules/sales/components/LineItemsTable'
import OrderSummary from '@/modules/sales/components/OrderSummary'
import OrderTimeline from '@/modules/sales/components/OrderTimeline'
import RecentActivity from '@/modules/sales/components/RecentActivity'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { erpNavItems, erpFooterNavItems } from '@/constants/navigation'
import type { HeaderTab, PageProps, LineItem, OrderDetailStatus } from '@/types'
import { toast } from 'react-hot-toast'
import { useErp } from '@/context/ErpContext'
import { generateInvoicePDF, type InvoiceData } from '@/utils/pdfGenerator'
import apiClient from '@/api/client'

export default function SalesOrderDetailPage({
  onNavigate,
}: PageProps) {
  const { salesOrders, activeOrderId, confirmSalesOrder, deliverSalesOrder, products } = useErp()
  
  // Find the active order or fallback to first
  const activeOrder = salesOrders.find(o => o.id === activeOrderId) || salesOrders[0]

  // Header state
  const [activeTab, setActiveTab] = useState<HeaderTab>('overview')
  const [searchQuery, setSearchQuery] = useState('')

  // Loading state
  const [loading, setLoading] = useState(true)

  const [customerName, setCustomerName] = useState(activeOrder?.customerName || '')
  const [billingAddress, setBillingAddress] = useState((activeOrder as any)?.billingAddress || 'Billing Address Not Available')
  const [orderDate, setOrderDate] = useState((activeOrder as any)?.createdAt || '')
  const [salesPerson, setSalesPerson] = useState('Sales Representative')
  const salesPersonOptions = ['Sales Rep', 'John Doe', 'Jane Smith']
  const TAX_RATE = 18
  const [orderStatus, setOrderStatus] = useState<OrderDetailStatus>(
    (activeOrder?.status === 'Completed' ? 'Delivered' : activeOrder?.status as any) || 'Draft'
  )
  
  const [lineItems, setLineItems] = useState<LineItem[]>([])
  const [auditLogs, setAuditLogs] = useState<any[]>([])

  // Sync state if activeOrder or products change
  useEffect(() => {
    if (activeOrder) {
      setCustomerName(activeOrder.customerName)
      setBillingAddress((activeOrder as any).billingAddress || 'Billing Address Not Available')
      setOrderDate(activeOrder.createdAt || '')
      setOrderStatus(activeOrder.status === 'Completed' ? 'Delivered' : activeOrder.status as any)
      
      const mapped = activeOrder.items?.map((item: any) => {
        const product = products.find(p => p.id === item.productId)
        return {
          id: item.id,
          product: product?.name || `Product ${item.productId}`,
          orderedQty: item.quantity,
          deliveredQty: (item as any).deliveredQuantity || 0,
          costPrice: product?.costPrice || 0,
          salesPrice: item.price,
          total: item.quantity * item.price
        }
      }) || []
      setLineItems(mapped)

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

  // Computed values
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0)
  const taxAmount = subtotal * (TAX_RATE / 100)
  const total = subtotal + taxAmount

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleButtonClick = () => {
    toast('Action triggered')
  }

  const handleCancel = async () => {
    try {
      await apiClient.post(`/sales/${activeOrder.id}/cancel`)
      setOrderStatus('Cancelled')
      toast.error('Order cancelled')
      onNavigate('sales')
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel')
    }
  }

  const handleDeliver = async () => {
    await deliverSalesOrder(activeOrder.id)
  }

  const handleConfirm = async () => {
    await confirmSalesOrder(activeOrder.id)
  }

  const handleDownloadPDF = () => {
    const invoiceData: InvoiceData = {
      reference: activeOrder.reference,
      status: activeOrder.status,
      customerName: customerName,
      billingAddress: billingAddress,
      orderDate: new Date(activeOrder.createdAt).toLocaleDateString(),
      salesPerson: salesPerson,
      lineItems: lineItems.map(li => ({
        product: li.product,
        quantity: li.orderedQty,
        price: li.salesPrice,
        total: li.total
      })),
      subtotal,
      taxAmount,
      total
    }
    
    generateInvoicePDF(invoiceData)
    toast.success('Invoice PDF Downloaded')
  }

  const handleAddRow = () => {
    toast.error('Line items cannot be added directly to an active Sales Order.')
  }

  const handleProductClick = (productName: string) => {
    toast(`Product: ${productName}`)
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <ErpSidebar
        navItems={erpNavItems}
        footerItems={erpFooterNavItems}
        activePage="sales"
        onNavigate={onNavigate}
        onNewRecordClick={handleButtonClick}
      />

      <div className="ml-60 flex min-h-screen flex-col">
        <ErpHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onButtonClick={handleButtonClick}
          searchPlaceholder="Search..."
        />

        {loading ? (
          <LoadingSpinner className="mt-32" />
        ) : (
          <main className="flex-1 p-6">
            <div className="flex gap-6">
              {/* Main content area */}
              <div className="min-w-0 flex-1">
                <OrderDetailHeader
                  reference={activeOrder?.reference || 'Unknown'}
                  status={orderStatus}
                  onCancel={handleCancel}
                  onDeliver={handleDeliver}
                  onConfirm={handleConfirm}
                  onBackToSales={() => onNavigate('sales')}
                  onDownloadPDF={handleDownloadPDF}
                />

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  {/* Customer Info + Order Details */}
                  <div className="flex gap-10">
                    <CustomerInfoSection
                      customerName={customerName}
                      billingAddress={billingAddress}
                      onCustomerNameChange={setCustomerName}
                      onBillingAddressChange={setBillingAddress}
                    />
                    <OrderDetailsSection
                      orderDate={orderDate}
                      salesPerson={salesPerson}
                      salesPersonOptions={salesPersonOptions}
                      onOrderDateChange={setOrderDate}
                      onSalesPersonChange={setSalesPerson}
                    />
                  </div>

                  {/* Divider */}
                  <div className="my-6 border-t border-slate-200" />

                  {/* Line Items */}
                  <LineItemsTable
                    items={lineItems}
                    onAddRow={handleAddRow}
                    onProductClick={handleProductClick}
                  />

                  {/* Order Summary */}
                  <OrderSummary
                    subtotal={subtotal}
                    taxRate={TAX_RATE}
                    taxAmount={taxAmount}
                    total={total}
                  />
                </div>
              </div>

              {/* Right sidebar panels */}
              <div className="w-64 shrink-0 space-y-4">
                <OrderTimeline 
                  steps={auditLogs.slice(0, 3).map((log: any, idx: number) => ({
                    id: log._id || String(idx),
                    label: log.action,
                    description: `Action on ${new Date(log.createdAt).toLocaleDateString()}`,
                    status: log.action === 'Created' ? 'completed' : 'current'
                  }))} 
                />
                <RecentActivity 
                  activities={auditLogs.map((log: any, idx: number) => ({
                    id: log._id || String(idx),
                    title: log.action,
                    description: log.fieldChanged ? `Changed ${log.fieldChanged} to "${log.newValue}"` : `Sales Order status updated`
                  }))} 
                />
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  )
}
