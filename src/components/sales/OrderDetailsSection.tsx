import { Calendar, ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface OrderDetailsSectionProps {
  orderDate: string
  salesPerson: string
  salesPersonOptions: string[]
  onOrderDateChange: (value: string) => void
  onSalesPersonChange: (value: string) => void
}

export default function OrderDetailsSection({
  orderDate,
  salesPerson,
  salesPersonOptions,
  onOrderDateChange,
  onSalesPersonChange,
}: OrderDetailsSectionProps) {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className="flex-1">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-indigo-600">
        Order Details
      </h3>

      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Order Date <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={orderDate}
            onChange={(e) => onOrderDateChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 pr-10 text-sm text-slate-800 transition-colors focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      <div className="relative">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Sales Person
        </label>
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 transition-colors hover:border-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <span>{salesPerson}</span>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
          />
        </button>

        {showDropdown && (
          <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
            {salesPersonOptions.map((person) => (
              <button
                key={person}
                type="button"
                onClick={() => {
                  onSalesPersonChange(person)
                  setShowDropdown(false)
                }}
                className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-indigo-50 ${
                  person === salesPerson
                    ? 'bg-indigo-50 font-medium text-indigo-700'
                    : 'text-slate-700'
                }`}
              >
                {person}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
