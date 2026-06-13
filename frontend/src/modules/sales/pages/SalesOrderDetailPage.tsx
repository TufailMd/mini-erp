import { useState, useEffect } from 'react'
import ErpSidebar from '@/modules/sales/components/ErpSidebar'
import ErpHeader from '@/modules/sales/components/ErpHeader'
import OrderDetailHeader from '@/modules/sales/components/OrderDetailHeader'
import CustomerInfoSection from '@/modules/sales/components/CustomerInfoSection'
import OrderDetailsSection from '@/modules/sales/components/OrderDetailsSection'
import LineItemsTable from '@/modules/sales/components/LineItemsTable'
import OrderSummary from '@/modules/sales/components/OrderSummary'
import OrderTimeline from '@/modules/sales/components/OrderTimeline'
import RecentActivity from '@/modules/sales/components/RecentActivity'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import {
  erpNavItems,
  erpFooterNavItems,
} from '@/data/salesData'
import {
  salesOrderDetail,
  salesPersonOptions,
} from '@/data/orderDetailData'
import type { HeaderTab, PageProps, LineItem, OrderDetailStatus } from '@/types'
import { toast } from 'react-hot-toast'
import { useErp } from '@/context/ErpContext'
import { generateInvoicePDF, type InvoiceData } from '@/utils/pdfGenerator'

export default function SalesOrderDetailPage({
  onNavigate,
}: PageProps) {
  const { salesOrders, activeOrderId, confirmSalesOrder, deliverSalesOrder } = useErp()
  
  // Find the active order or fallback to first
  const activeOrder = salesOrders.find(o => o.id === activeOrderId) || salesOrders[0]

  // Header state
  const [activeTab, setActiveTab] = useState<HeaderTab>('overview')
  const [searchQuery, setSearchQuery] = useState('')

  // Loading state
  const [loading, setLoading] = useState(true)

  const [customerName, setCustomerName] = useState(activeOrder?.customerName || '')
  const [billingAddress, setBillingAddress] = useState(salesOrderDetail.billingAddress)
  const [orderDate, setOrderDate] = useState((activeOrder as any)?.createdAt || '')
  const [salesPerson, setSalesPerson] = useState(salesOrderDetail.salesPerson)
  const [orderStatus, setOrderStatus] = useState<OrderDetailStatus>(
    (activeOrder?.status === 'Completed' ? 'Delivered' : activeOrder?.status as any) || 'Draft'
  )
  
  // Convert ErpOrderItems to LineItems
  const [lineItems, setLineItems] = useState<LineItem[]>(
    activeOrder?.items?.map(item => ({
      id: item.id,
      product: `Product ${item.productId}`, // We don't have product names joined here easily without more hooks, this is a mock
      orderedQty: item.quantity,
      deliveredQty: activeOrder.status === 'Completed' ? item.quantity : 0,
      costPrice: 0,
      salesPrice: item.price,
      total: item.quantity * item.price
    })) || []
  )

  // Sync state if activeOrder changes (due to context update)
  useEffect(() => {
    if (activeOrder) {
      setCustomerName(activeOrder.customerName)
      setOrderDate((activeOrder as any).createdAt || '')
      setOrderStatus(activeOrder.status === 'Completed' ? 'Delivered' : activeOrder.status as any)
      setLineItems(activeOrder.items?.map(item => ({
        id: item.id,
        product: `Product ${item.productId}`,
        orderedQty: item.quantity,
        deliveredQty: activeOrder.status === 'Completed' ? item.quantity : 0,
        costPrice: 0,
        salesPrice: item.price,
        total: item.quantity * item.price
      })) || [])
    }
  }, [activeOrder])

  // Computed values
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0)
  const taxAmount = subtotal * (salesOrderDetail.taxRate / 100)
  const total = subtotal + taxAmount

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  const handleButtonClick = () => {
    toast('Action triggered')
  }

  const handleCancel = () => {
    // In a full app, we'd have a cancel action in context
    setOrderStatus('Cancelled')
    toast.error('Order cancelled')
  }

  const handleDeliver = () => {
    deliverSalesOrder(activeOrder.id)
  }

  const handleConfirm = () => {
    confirmSalesOrder(activeOrder.id)
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
    const newItem: LineItem = {
      id: String(lineItems.length + 1),
      product: 'New Product',
      orderedQty: 0,
      deliveredQty: 0,
      costPrice: 0,
      salesPrice: 0,
      total: 0,
    }
    setLineItems([...lineItems, newItem])
    toast.success('Row added')
  }

  const handleProductClick = (productName: string) => {
    toast(`Product clicked: ${productName}`)
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
                    taxRate={salesOrderDetail.taxRate}
                    taxAmount={taxAmount}
                    total={total}
                  />
                </div>
              </div>

              {/* Right sidebar panels */}
              <div className="w-64 shrink-0 space-y-4">
                <OrderTimeline steps={salesOrderDetail.timeline} />
                <RecentActivity activities={salesOrderDetail.recentActivity} />
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  )
}
