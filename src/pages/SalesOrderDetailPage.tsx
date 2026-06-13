import { useState, useEffect } from 'react'
import ErpSidebar from '../components/sales/ErpSidebar'
import ErpHeader from '../components/sales/ErpHeader'
import OrderDetailHeader from '../components/sales/OrderDetailHeader'
import CustomerInfoSection from '../components/sales/CustomerInfoSection'
import OrderDetailsSection from '../components/sales/OrderDetailsSection'
import LineItemsTable from '../components/sales/LineItemsTable'
import OrderSummary from '../components/sales/OrderSummary'
import OrderTimeline from '../components/sales/OrderTimeline'
import RecentActivity from '../components/sales/RecentActivity'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import {
  erpNavItems,
  erpFooterNavItems,
} from '../data/salesData'
import {
  salesOrderDetail,
  salesPersonOptions,
} from '../data/orderDetailData'
import type { HeaderTab, PageProps, LineItem, OrderDetailStatus } from '../types'

export default function SalesOrderDetailPage({
  activePage,
  onNavigate,
}: PageProps) {
  // Header state
  const [activeTab, setActiveTab] = useState<HeaderTab>('overview')
  const [searchQuery, setSearchQuery] = useState('')

  // Loading state
  const [loading, setLoading] = useState(true)

  // Form state
  const [customerName, setCustomerName] = useState(
    salesOrderDetail.customerName
  )
  const [billingAddress, setBillingAddress] = useState(
    salesOrderDetail.billingAddress
  )
  const [orderDate, setOrderDate] = useState(salesOrderDetail.orderDate)
  const [salesPerson, setSalesPerson] = useState(salesOrderDetail.salesPerson)
  const [orderStatus, setOrderStatus] = useState<OrderDetailStatus>(
    salesOrderDetail.status
  )
  const [lineItems, setLineItems] = useState<LineItem[]>(
    salesOrderDetail.lineItems
  )

  // Computed values
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0)
  const taxAmount = subtotal * (salesOrderDetail.taxRate / 100)
  const total = subtotal + taxAmount

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

  const handleDeliver = () => {
    setOrderStatus('Delivered')
    console.log('Order delivered')
  }

  const handleConfirm = () => {
    setOrderStatus('Confirmed')
    console.log('Order confirmed')
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
    console.log('Row added')
  }

  const handleProductClick = (productName: string) => {
    console.log('Product clicked:', productName)
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
                  reference={salesOrderDetail.reference}
                  status={orderStatus}
                  onCancel={handleCancel}
                  onDeliver={handleDeliver}
                  onConfirm={handleConfirm}
                  onBackToSales={() => onNavigate('sales')}
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
