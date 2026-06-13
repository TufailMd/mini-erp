import { MoreVertical, ShoppingCart, Building2 } from 'lucide-react'
import type { VendorMetric } from '../../types'

interface VendorIntelligenceProps {
  vendorName: string
  metrics: VendorMetric[]
  onIssuePO: () => void
}

export default function VendorIntelligence({
  vendorName,
  metrics,
  onIssuePO,
}: VendorIntelligenceProps) {
  return (
    <div className="flex-[2] rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-bold text-slate-900">Vendor Intelligence</h2>
        <button
          type="button"
          className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      <div className="p-5">
        {/* Vendor Profile */}
        <div className="mb-5 flex flex-col items-center text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">{vendorName}</h3>
          <p className="text-xs text-slate-500">Primary Supplier since 2019</p>

          <div className="mt-3 flex gap-2">
            <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
              Tier 1
            </span>
            <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-green-700">
              Global Partner
            </span>
          </div>
        </div>

        {/* Performance Metrics */}
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Performance Metrics
        </p>

        <div className="mb-5 grid grid-cols-2 gap-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-lg border border-slate-100 bg-slate-50/70 p-3"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {metric.label}
              </p>
              <p className={`mt-1 text-lg font-bold ${metric.valueClass}`}>
                {metric.value}
              </p>
              <p className="text-[11px] text-slate-500">{metric.sub}</p>
            </div>
          ))}
        </div>

        {/* Issue PO Button */}
        <button
          type="button"
          onClick={onIssuePO}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <ShoppingCart className="h-4 w-4" />
          Issue New Purchase Order
        </button>
      </div>
    </div>
  )
}
