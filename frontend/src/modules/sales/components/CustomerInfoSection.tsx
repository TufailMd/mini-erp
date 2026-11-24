import { Search } from 'lucide-react'
import { useState } from 'react'

interface CustomerInfoSectionProps {
  customerName: string
  billingAddress: string
  selectedCustomerId: string
  customerOptions: Array<{ id: string; label: string }>
  customersLoading: boolean
  customersError: string | null
  disabled?: boolean
  onCustomerChange: (customerId: string) => void
  onBillingAddressChange: (value: string) => void
}

export default function CustomerInfoSection({
  customerName,
  billingAddress,
  selectedCustomerId,
  customerOptions,
  customersLoading,
  customersError,
  disabled = false,
  onCustomerChange,
  onBillingAddressChange,
}: CustomerInfoSectionProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const selectedCustomer = customerOptions.find(
    (option) => option.id === selectedCustomerId,
  )
  const selectorDisabled =
    disabled ||
    customersLoading ||
    Boolean(customersError) ||
    customerOptions.length === 0

  return (
    <div className="flex-1">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-indigo-600">
        Customer Information
      </h3>

      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Customer Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown((visible) => !visible)}
            disabled={selectorDisabled}
            aria-expanded={showDropdown}
            className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2.5 pr-10 text-sm text-slate-800 transition-colors hover:border-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
          >
            <span>
              {customersLoading
                ? 'Loading customers...'
                : selectedCustomer?.label || customerName || 'Select a customer'}
            </span>
          </button>
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          {showDropdown && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
              {customerOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onCustomerChange(option.id)
                    setShowDropdown(false)
                  }}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-indigo-50 ${
                    option.id === selectedCustomerId
                      ? 'bg-indigo-50 font-medium text-indigo-700'
                      : 'text-slate-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
        {customersError ? (
          <p role="alert" className="mt-1.5 text-xs text-red-600">
            Could not load active customers: {customersError}
          </p>
        ) : !customersLoading && customerOptions.length === 0 ? (
          <p className="mt-1.5 text-xs text-slate-500">
            No active customers available.
          </p>
        ) : null}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Billing Address
        </label>
        <input
          type="text"
          value={billingAddress}
          onChange={(e) => onBillingAddressChange(e.target.value)}
          disabled={disabled}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 transition-colors focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50"
        />
      </div>
    </div>
  )
}
