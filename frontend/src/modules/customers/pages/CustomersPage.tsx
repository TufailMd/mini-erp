import { useEffect, useState } from 'react'
import { Eye, Plus, RefreshCw, Search } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ErpSidebar from '@/components/layout/ErpSidebar'
import { erpFooterNavItems, erpNavItems } from '@/constants/navigation'
import { useErp } from '@/context/ErpContext'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import Pagination from '@/components/common/Pagination'
import { customerApi } from '@/api/customerApi'
import type { CustomerType, ErpCustomer } from '@/types/erp'
import type { PageProps } from '@/types'

const PAGE_SIZE = 20

export default function CustomersPage({
  activePage,
  onNavigate,
}: PageProps) {
  const { setActiveOrderId } = useErp()
  const [customers, setCustomers] = useState<ErpCustomer[]>([])
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [customerType, setCustomerType] = useState<'All' | CustomerType>('All')
  const [status, setStatus] = useState<'All' | 'Active' | 'Inactive'>('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingCustomerId, setUpdatingCustomerId] = useState<string | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput)
      setCurrentPage(1)
    }, 300)
    return () => window.clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    let cancelled = false

    const fetchCustomers = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await customerApi.getCustomers({
          search: search || undefined,
          customer_type: customerType === 'All' ? undefined : customerType,
          is_active:
            status === 'All'
              ? undefined
              : status === 'Active',
          page: currentPage,
          limit: PAGE_SIZE,
        })

        if (!cancelled) {
          setCustomers(result.data)
          setTotalItems(result.total)
          setTotalPages(Math.max(1, result.totalPages))
          if (result.page !== currentPage) setCurrentPage(result.page)
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Failed to load customers'
          setError(message)
          toast.error(message)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchCustomers()
    return () => {
      cancelled = true
    }
  }, [search, customerType, status, currentPage])

  const openNewCustomer = () => {
    setActiveOrderId(null)
    onNavigate('customer-detail')
  }

  const openCustomer = (customerId: string) => {
    setActiveOrderId(customerId)
    onNavigate('customer-detail')
  }

  const handleCustomerTypeChange = (value: 'All' | CustomerType) => {
    setCustomerType(value)
    setCurrentPage(1)
  }

  const handleStatusChange = (value: 'All' | 'Active' | 'Inactive') => {
    setStatus(value)
    setCurrentPage(1)
  }

  const refreshCustomers = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await customerApi.getCustomers({
        search: search || undefined,
        customer_type: customerType === 'All' ? undefined : customerType,
        is_active:
          status === 'All' ? undefined : status === 'Active',
        page: currentPage,
        limit: PAGE_SIZE,
      })
      setCustomers(result.data)
      setTotalItems(result.total)
      setTotalPages(Math.max(1, result.totalPages))
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load customers'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleCustomerStatusChange = async (customer: ErpCustomer) => {
    if (updatingCustomerId) return

    const action = customer.is_active ? 'deactivate' : 'reactivate'
    const actionLabel = customer.is_active ? 'Deactivate' : 'Reactivate'
    if (
      !window.confirm(
        `${actionLabel} ${customer.name}? ${
          customer.is_active
            ? 'The customer can be reactivated later.'
            : 'The customer will become active again.'
        }`,
      )
    ) {
      return
    }

    setUpdatingCustomerId(customer._id)
    try {
      if (customer.is_active) {
        await customerApi.deleteCustomer(customer._id)
      } else {
        await customerApi.updateCustomer(customer._id, { is_active: true })
      }
      toast.success(`Customer ${customer.name} ${action}d successfully`)
      await refreshCustomers()
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : `Failed to ${action} customer`
      toast.error(message)
    } finally {
      setUpdatingCustomerId(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <ErpSidebar
        navItems={erpNavItems}
        footerItems={erpFooterNavItems}
        activePage={activePage}
        onNavigate={onNavigate}
        onNewRecordClick={openNewCustomer}
      />
      <div className="ml-60 flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <h1 className="text-lg font-semibold text-slate-900">
            Customer Master
          </h1>
          <button
            type="button"
            onClick={openNewCustomer}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Create Customer
          </button>
        </header>

        <main className="flex-1 p-6">
          <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(240px,1fr)_180px_180px_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search name, code, email, phone, or company"
                className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <select
              value={customerType}
              onChange={(event) =>
                handleCustomerTypeChange(
                  event.target.value as 'All' | CustomerType,
                )
              }
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="All">All Types</option>
              <option value="INDIVIDUAL">Individual</option>
              <option value="BUSINESS">Business</option>
            </select>
            <select
              value={status}
              onChange={(event) =>
                handleStatusChange(
                  event.target.value as 'All' | 'Active' | 'Inactive',
                )
              }
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <button
              type="button"
              onClick={refreshCustomers}
              disabled={loading}
              className="flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
              <p className="text-sm font-medium text-red-600">{error}</p>
              <button
                type="button"
                onClick={refreshCustomers}
                className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80">
                      {[
                        'Code',
                        'Customer',
                        'Type',
                        'Company',
                        'Email',
                        'Phone',
                        'City / State',
                        'Status',
                        'Actions',
                      ].map((label) => (
                        <th
                          key={label}
                          className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500"
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customers.map((customer) => (
                      <tr
                        key={customer._id}
                        onClick={() => openCustomer(customer._id)}
                        className="cursor-pointer transition-colors hover:bg-slate-50/50"
                      >
                        <td className="px-4 py-4 font-mono text-sm font-medium text-indigo-600">
                          {customer.customer_code}
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm font-semibold text-slate-900">
                            {customer.name}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">
                          {customer.customer_type === 'BUSINESS'
                            ? 'Business'
                            : 'Individual'}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">
                          {customer.company_name || '-'}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">
                          {customer.email || '-'}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">
                          {customer.phone || '-'}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">
                          {[customer.city, customer.state].filter(Boolean).join(' / ') || '-'}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              customer.is_active
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {customer.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              openCustomer(customer._id)
                            }}
                            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                            aria-label={`View ${customer.name}`}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              void handleCustomerStatusChange(customer)
                            }}
                            disabled={updatingCustomerId !== null}
                            className={`ml-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                              customer.is_active
                                ? 'text-amber-700 hover:bg-amber-50'
                                : 'text-emerald-700 hover:bg-emerald-50'
                            }`}
                          >
                            {updatingCustomerId === customer._id
                              ? customer.is_active
                                ? 'Deactivating...'
                                : 'Reactivating...'
                              : customer.is_active
                                ? 'Deactivate'
                                : 'Reactivate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {customers.length === 0 && (
                  <div className="py-12 text-center text-sm text-slate-500">
                    No customers match your filters.
                  </div>
                )}
              </div>
              {customers.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  pageSize={PAGE_SIZE}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
