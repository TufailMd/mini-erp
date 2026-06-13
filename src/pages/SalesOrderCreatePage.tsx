import { useState, useEffect } from 'react'
import ErpSidebar from '../components/sales/ErpSidebar'
import SalesOrderCreateHeader from '../components/sales/SalesOrderCreateHeader'
import SalesOrderBanner from '../components/sales/SalesOrderBanner'
import EntityInformation from '../components/sales/EntityInformation'
import InternalControl from '../components/sales/InternalControl'
import OrderHealth from '../components/sales/OrderHealth'
import AttachmentsPanel from '../components/sales/AttachmentsPanel'
import SalesLineItems from '../components/sales/SalesLineItems'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import { erpNavItems, erpFooterNavItems } from '../data/salesData'
import {
  salesOrderCreateData,
  customerOptions,
  salesRepOptions,
} from '../data/salesOrderCreateData'
import type { PageProps, CreateLineItem, AssignedUser } from '../types'

export default function SalesOrderCreatePage({
  onNavigate,
}: PageProps) {
  const [loading, setLoading] = useState(true)

  // Form state
  const [customerName, setCustomerName] = useState(
    salesOrderCreateData.customerName,
  )
  const [orderDate, setOrderDate] = useState(salesOrderCreateData.orderDate)
  const [assignedUser, setAssignedUser] = useState<AssignedUser>(
    salesOrderCreateData.assignedUser,
  )
  const [lineItems, setLineItems] = useState<CreateLineItem[]>(
    salesOrderCreateData.lineItems,
  )
  const [status, setStatus] = useState(salesOrderCreateData.status)

  // Computed
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0)
  const taxAmount = subtotal * (salesOrderCreateData.taxRate / 100)
  const total = subtotal + taxAmount

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleBack = () => {
    onNavigate('sales')
  }

  const handleCancel = () => {
    setStatus('Cancelled')
    console.log('Order cancelled')
  }

  const handleDeliver = () => {
    console.log('Deliver clicked')
  }

  const handleConfirm = () => {
    setStatus('Confirmed')
    console.log('Order confirmed')
  }

  const handleAssignedUserChange = (name: string) => {
    setAssignedUser({
      name,
      initials: name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2),
      role: 'Account Executive',
    })
  }

  const handleAddRow = () => {
    const newItem: CreateLineItem = {
      id: String(lineItems.length + 1),
      rowNum: lineItems.length + 1,
      product: 'New Product',
      sku: 'NEW-SKU-001',
      orderedQty: 0,
      deliveredQty: 0,
      unitPrice: 0,
      total: 0,
    }
    setLineItems([...lineItems, newItem])
    console.log('Row added')
  }

  const handleDeleteRow = (id: string) => {
    setLineItems((prev) =>
      prev
        .filter((item) => item.id !== id)
        .map((item, idx) => ({ ...item, rowNum: idx + 1 })),
    )
    console.log('Row deleted:', id)
  }

  const handleButtonClick = () => {
    console.log('clicked')
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
        <SalesOrderCreateHeader
          reference={salesOrderCreateData.reference}
          status={status}
          onBack={handleBack}
          onCancel={handleCancel}
          onDeliver={handleDeliver}
          onConfirm={handleConfirm}
        />

        {loading ? (
          <LoadingSpinner className="mt-32" />
        ) : (
          <main className="flex-1 p-6">
            <SalesOrderBanner />

            <div className="flex gap-6">
              {/* Main form area */}
              <div className="min-w-0 flex-1">
                <EntityInformation
                  customerName={customerName}
                  orderDate={orderDate}
                  billingAddress={salesOrderCreateData.billingAddress}
                  customerOptions={customerOptions}
                  onCustomerChange={setCustomerName}
                  onDateChange={setOrderDate}
                  onAddressChange={handleButtonClick as unknown as (v: string) => void}
                />

                <SalesLineItems
                  items={lineItems}
                  subtotal={subtotal}
                  taxRate={salesOrderCreateData.taxRate}
                  taxAmount={taxAmount}
                  total={total}
                  onAddRow={handleAddRow}
                  onDeleteRow={handleDeleteRow}
                />
              </div>

              {/* Right sidebar panels */}
              <div className="w-64 shrink-0 space-y-4">
                <InternalControl
                  assignedUser={assignedUser}
                  salesRepOptions={salesRepOptions}
                  onAssignedUserChange={handleAssignedUserChange}
                />

                <OrderHealth
                  stockReadiness={salesOrderCreateData.stockReadiness}
                  trend={salesOrderCreateData.stockReadinessTrend}
                />

                <AttachmentsPanel
                  count={salesOrderCreateData.attachmentCount}
                  onBrowse={handleButtonClick}
                />
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  )
}
