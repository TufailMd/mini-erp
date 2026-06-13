import { Filter, Download, Mail, Phone } from 'lucide-react'
import type { Vendor, VendorCategory } from '../../types'
import LoadingSpinner from '../shared/LoadingSpinner'

interface VendorDirectoryProps {
  vendors: Vendor[]
  selectedVendorId: string | null
  onVendorClick: (vendorId: string) => void
  loading: boolean
}

const categoryBadgeClass: Record<VendorCategory, string> = {
  Manufacturing: 'bg-purple-100 text-purple-700',
  Logistics: 'bg-orange-100 text-orange-700',
  'Raw Material': 'bg-teal-100 text-teal-700',
  Technology: 'bg-blue-100 text-blue-700',
  Services: 'bg-slate-100 text-slate-700',
}

export default function VendorDirectory({
  vendors,
  selectedVendorId,
  onVendorClick,
  loading,
}: VendorDirectoryProps) {
  const tabs = ['All', 'Suppliers', 'Service Providers'] as const
  const activeTab = 'All'

  return (
    <div className="flex-[3] rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-bold text-slate-900">Vendor Directory</h2>
        <div className="flex items-center gap-2">
          {/* Tab pills */}
          <div className="flex rounded-lg bg-slate-100 p-0.5">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  tab === activeTab
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Vendor Name
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Contact Person
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Contact Info
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Category
                </th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr
                  key={vendor.id}
                  onClick={() => onVendorClick(vendor.id)}
                  className={`cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50 ${
                    selectedVendorId === vendor.id ? 'bg-indigo-50/50' : ''
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${vendor.initialsBg}`}
                      >
                        {vendor.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {vendor.name}
                        </p>
                        <p className="text-xs text-slate-400">{vendor.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm text-slate-700">{vendor.contactPerson}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Mail className="h-3 w-3 text-slate-400" />
                        {vendor.email}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Phone className="h-3 w-3 text-slate-400" />
                        {vendor.phone}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${categoryBadgeClass[vendor.category]}`}
                    >
                      {vendor.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
