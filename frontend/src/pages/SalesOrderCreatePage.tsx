import { useState, useEffect } from 'react'
import ErpSidebar from '@/modules/sales/components/ErpSidebar'
import SalesOrderCreateHeader from '@/modules/sales/components/SalesOrderCreateHeader'
import SalesOrderBanner from '@/modules/sales/components/SalesOrderBanner'
import EntityInformation from '@/modules/sales/components/EntityInformation'
import InternalControl from '@/modules/sales/components/InternalControl'
import OrderHealth from '@/modules/sales/components/OrderHealth'
import AttachmentsPanel from '@/modules/sales/components/AttachmentsPanel'
import SalesLineItems from '@/modules/sales/components/SalesLineItems'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { erpNavItems, erpFooterNavItems } from '@/data/salesData'
import {
  salesOrderCreateData,
  customerOptions,
  salesRepOptions,
} from '@/data/salesOrderCreateData'
import type { PageProps, CreateLineItem, AssignedUser } from '@/types'
import { toast } from 'react-hot-toast'
import { useErp } from '@/context/ErpContext'

export default function SalesOrderCreatePage({
  onNavigate,
}: PageProps) {
  const { createSalesOrder } = useErp()
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
    toast.error('Order cancelled')
  }

  const handleDeliver = () => {
    toast.success('Deliver clicked')
  }

  const handleConfirm = async () => {
    // In our context, we create a draft, then the detail page handles 'Confirm'
    const mappedItems = lineItems.map(item => ({
      productId: item.sku,
      quantity: item.orderedQty,
      price: item.unitPrice
    }))
    try {
      await createSalesOrder(customerName, mappedItems)
      onNavigate('sales-order-detail')
    } catch (err) {
      // Error handled in context
    }
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
    toast.success('Row added')
  }

  const handleDeleteRow = (id: string) => {
    setLineItems((prev) =>
      prev
        .filter((item) => item.id !== id)
        .map((item, idx) => ({ ...item, rowNum: idx + 1 })),
    )
    toast.error(`Row deleted: ${id}`)
  }

  const handleButtonClick = () => {
    toast('Action triggered')
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
