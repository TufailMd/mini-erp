import { useState, useEffect, useRef } from 'react'
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
import { customerApi } from '@/api/customerApi'
import { salesApi } from '@/api/salesApi'
import { userApi } from '@/api/userApi'
import type { ErpCustomer } from '@/types/erp'

const CUSTOMER_PAGE_SIZE = 100

function formatCustomerAddress(customer: ErpCustomer): string {
  const cityAndState = [customer.city, customer.state]
    .filter(Boolean)
    .join(', ')
  const location = [cityAndState, customer.postal_code]
    .filter(Boolean)
    .join(' ')

  return [customer.billing_address, location, customer.country]
    .filter(Boolean)
    .join(', ')
}

export default function SalesOrderDetailPage({
  onNavigate,
}: PageProps) {
  const { salesOrders, activeOrderId, confirmSalesOrder, deliverSalesOrder, products, refreshData } = useErp()
  
  // Find the active order or fallback to first
  const activeOrder = salesOrders.find(o => o.id === activeOrderId) || salesOrders[0]

  // Header state
  const [activeTab, setActiveTab] = useState<HeaderTab>('overview')
  const [searchQuery, setSearchQuery] = useState('')

  // Loading state
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const saveInProgressRef = useRef(false)
  const [customers, setCustomers] = useState<ErpCustomer[]>([])
  const [customersLoading, setCustomersLoading] = useState(true)
  const [customersError, setCustomersError] = useState<string | null>(null)
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [salesPersonId, setSalesPersonId] = useState<string | undefined>(undefined)
  const [initialCustomerName, setInitialCustomerName] = useState('')
  const [initialBillingAddress, setInitialBillingAddress] = useState('')
  const [customerSelectionChanged, setCustomerSelectionChanged] = useState(false)
  const [addressChanged, setAddressChanged] = useState(false)
  const [salesPersonOptions, setSalesPersonOptions] = useState<string[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [salesPersonLoading, setSalesPersonLoading] = useState(true)
  const [salesPersonError, setSalesPersonError] = useState<string | null>(null)

  const [customerName, setCustomerName] = useState(activeOrder?.customerName || '')
  const [billingAddress, setBillingAddress] = useState((activeOrder as any)?.billingAddress || 'Billing Address Not Available')
  const [orderDate, setOrderDate] = useState((activeOrder as any)?.createdAt || '')
  const [salesPerson, setSalesPerson] = useState('Sales Representative')
  const TAX_RATE = 18
  const [orderStatus, setOrderStatus] = useState<OrderDetailStatus>(
    (activeOrder?.status === 'Completed' ? 'Delivered' : activeOrder?.status as any) || 'Draft'
  )
  const isDraft = orderStatus === 'Draft'
  
  const [lineItems, setLineItems] = useState<LineItem[]>([])
  const [auditLogs, setAuditLogs] = useState<any[]>([])

  // Sync state if activeOrder or products change
  useEffect(() => {
    if (activeOrder) {
      setCustomerName(activeOrder.customerName)
      const snapshotAddress =
        (activeOrder as any).billingAddress || 'Billing Address Not Available'
      setInitialCustomerName(activeOrder.customerName)
      setInitialBillingAddress(snapshotAddress)
      setBillingAddress(snapshotAddress)
      setCustomerSelectionChanged(false)
      setAddressChanged(false)
      setOrderDate(activeOrder.createdAt || '')
      setOrderStatus(activeOrder.status === 'Completed' ? 'Delivered' : activeOrder.status as any)
      setSalesPersonId(undefined)
      setSelectedCustomerId('')
      
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
      const fetchOrderDetails = async () => {
        try {
          const detail = await salesApi.getOrderById(activeOrder.id) as any
          const raw = detail?.data || detail
          if (raw?.sales_person) {
            setSalesPersonId(
              typeof raw.sales_person === 'string'
                ? raw.sales_person
                : raw.sales_person._id,
            )
            setSalesPerson(
              typeof raw.sales_person === 'string'
                ? 'Sales Representative'
                : raw.sales_person.name || 'Sales Representative',
            )
          }
        } catch (e) {
          // Snapshot fields remain available from the context mapping
        }
      }
      fetchLogs()
      fetchOrderDetails()
    }
  }, [activeOrder, products])

  useEffect(() => {
    let cancelled = false

    const fetchActiveCustomers = async () => {
      setCustomersLoading(true)
      setCustomersError(null)
      try {
        const firstPage = await customerApi.getCustomers({
          is_active: true,
          page: 1,
          limit: CUSTOMER_PAGE_SIZE,
        })
        const activeCustomers = firstPage.data.filter(
          (customer) => customer.is_active,
        )

        for (let page = 2; page <= firstPage.totalPages; page += 1) {
          const result = await customerApi.getCustomers({
            is_active: true,
            page,
            limit: CUSTOMER_PAGE_SIZE,
          })
          activeCustomers.push(
            ...result.data.filter((customer) => customer.is_active),
          )
        }

        if (!cancelled) {
          setCustomers(activeCustomers)
          const matchingCustomer = activeCustomers.find(
            (customer) => customer.name === activeOrder?.customerName,
          )
          if (matchingCustomer) setSelectedCustomerId(matchingCustomer._id)
        }
      } catch (error: unknown) {
        if (!cancelled) {
          const message =
            error instanceof Error
              ? error.message
              : 'Failed to load customers'
          setCustomersError(message)
          toast.error(message)
        }
      } finally {
        if (!cancelled) setCustomersLoading(false)
      }
    }

    void fetchActiveCustomers()
    return () => {
      cancelled = true
    }
  }, [activeOrder?.customerName])

  useEffect(() => {
    let cancelled = false

    const fetchUsers = async () => {
      setSalesPersonLoading(true)
      setSalesPersonError(null)
      try {
        const response = await userApi.getUsers()
        const list = Array.isArray(response)
          ? response
          : Array.isArray((response as any)?.data)
            ? (response as any).data
            : []
        if (!cancelled) {
          setUsers(list)
          setSalesPersonOptions(
            list
              .map((user: any) => user.name || user.email)
              .filter((name: unknown): name is string => Boolean(name)),
          )
        }
      } catch (error: unknown) {
        if (!cancelled) {
          const message =
            error instanceof Error
              ? error.message
              : 'Failed to load sales persons'
          setSalesPersonError(message)
          toast.error(message)
        }
      } finally {
        if (!cancelled) setSalesPersonLoading(false)
      }
    }

    void fetchUsers()
    return () => {
      cancelled = true
    }
  }, [])

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

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find((item) => item._id === customerId)
    if (!customer) return

    setSelectedCustomerId(customer._id)
    setCustomerSelectionChanged(true)
    setAddressChanged(false)
    setCustomerName(customer.name)
    setBillingAddress(formatCustomerAddress(customer))
  }

  const handleBillingAddressChange = (value: string) => {
    setBillingAddress(value)
    setAddressChanged(true)
  }

  const handleSalesPersonChange = (name: string) => {
    const selectedUser = users.find(
      (user) => (user.name || user.email) === name,
    )
    if (!selectedUser?._id) return

    setSalesPerson(name)
    setSalesPersonId(selectedUser._id)
  }

  const handleSave = async () => {
    if (!isDraft || saving || saveInProgressRef.current) return

    const payloadProducts = activeOrder.items?.map((item) => {
      return {
        product_id: item.productId,
        ordered_quantity: Number(item.quantity),
        units: 'Units',
        sales_unit_price: Number(item.price),
      }
    }) || []

    if (payloadProducts.length === 0) {
      toast.error('At least one product is required')
      return
    }

    const selectedCustomer = customers.find(
      (customer) => customer._id === selectedCustomerId,
    )

    saveInProgressRef.current = true
    setSaving(true)
    try {
      await salesApi.updateSalesOrder(activeOrder.id, {
        customer: customerSelectionChanged && selectedCustomer
          ? customerName
          : initialCustomerName,
        customer_address: customerSelectionChanged || addressChanged
          ? billingAddress
          : initialBillingAddress,
        ...(salesPersonId ? { sales_person: salesPersonId } : {}),
        products: payloadProducts,
      })
      toast.success('Sales Order saved successfully')
      await refreshData()
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to save Sales Order'
      toast.error(message)
    } finally {
      saveInProgressRef.current = false
      setSaving(false)
    }
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
                  onSave={isDraft ? handleSave : undefined}
                  saveDisabled={saving || customersLoading}
                  saving={saving}
                  onBackToSales={() => onNavigate('sales')}
                  onDownloadPDF={handleDownloadPDF}
                />

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  {/* Customer Info + Order Details */}
                  {salesPersonError ? (
                    <p role="alert" className="mb-4 text-xs text-red-600">
                      Could not load sales persons: {salesPersonError}
                    </p>
                  ) : null}
                  <div className="flex gap-10">
                    <CustomerInfoSection
                      customerName={customerName}
                      billingAddress={billingAddress}
                      selectedCustomerId={selectedCustomerId}
                      customerOptions={customers.map((customer) => ({
                        id: customer._id,
                        label: `${customer.name} (${customer.customer_code})`,
                      }))}
                      customersLoading={customersLoading}
                      customersError={customersError}
                      disabled={!isDraft || saving}
                      onCustomerChange={handleCustomerChange}
                      onBillingAddressChange={handleBillingAddressChange}
                    />
                    <OrderDetailsSection
                      orderDate={orderDate}
                      salesPerson={salesPerson}
                      salesPersonOptions={salesPersonOptions}
                      disabled={!isDraft || saving || salesPersonLoading || Boolean(salesPersonError)}
                      onOrderDateChange={setOrderDate}
                      onSalesPersonChange={handleSalesPersonChange}
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
