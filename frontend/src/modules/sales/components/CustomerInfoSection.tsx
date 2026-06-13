import { Search } from 'lucide-react'

interface CustomerInfoSectionProps {
  customerName: string
  billingAddress: string
  onCustomerNameChange: (value: string) => void
  onBillingAddressChange: (value: string) => void
}

export default function CustomerInfoSection({
  customerName,
  billingAddress,
  onCustomerNameChange,
  onBillingAddressChange,
}: CustomerInfoSectionProps) {
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
          <input
            type="text"
            value={customerName}
            onChange={(e) => onCustomerNameChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 pr-10 text-sm text-slate-800 transition-colors focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Billing Address
        </label>
        <input
          type="text"
          value={billingAddress}
          onChange={(e) => onBillingAddressChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 transition-colors focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>
    </div>
  )
}
