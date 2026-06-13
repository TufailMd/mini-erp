import { Settings, ChevronDown, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import type { ProcurementConfig } from '@/types'

interface AutoProcurementProps {
  config: ProcurementConfig
  onToggleActive: () => void
  onRouteChange: (value: string) => void
  onVendorChange: (value: string) => void
}

export default function AutoProcurement({
  config,
  onToggleActive,
  onRouteChange,
  onVendorChange,
}: AutoProcurementProps) {
  const [showRouteDropdown, setShowRouteDropdown] = useState(false)
  const [showVendorDropdown, setShowVendorDropdown] = useState(false)

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Settings className="h-5 w-5 text-indigo-500" />
          <h3 className="text-lg font-bold text-slate-900">
            Auto-Procurement Strategy
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Activate System
          </span>
          <button
            type="button"
            onClick={onToggleActive}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              config.isActive ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                config.isActive ? 'left-[22px]' : 'left-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Dropdowns */}
      <div className="grid grid-cols-2 gap-6">
        {/* Route */}
        <div className="relative">
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Procurement Route <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => setShowRouteDropdown(!showRouteDropdown)}
            className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 transition-colors hover:border-slate-400"
          >
            <span>{config.route}</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
          {showRouteDropdown && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
              {config.routeOptions?.map((opt: string) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onRouteChange(opt)
                    setShowRouteDropdown(false)
                  }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-indigo-50 ${
                    opt === config.route
                      ? 'bg-indigo-50 font-medium text-indigo-700'
                      : 'text-slate-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Vendor */}
        <div className="relative">
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Primary Vendor <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => setShowVendorDropdown(!showVendorDropdown)}
            className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 transition-colors hover:border-slate-400"
          >
            <span>{config.vendor}</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
          {showVendorDropdown && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
              {config.vendorOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onVendorChange(opt)
                    setShowVendorDropdown(false)
                  }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-indigo-50 ${
                    opt === config.vendor
                      ? 'bg-indigo-50 font-medium text-indigo-700'
                      : 'text-slate-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info bar */}
      <div className="mt-5 flex items-center gap-2.5 rounded-lg bg-amber-50 px-4 py-2.5 text-xs text-amber-800">
        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
        <p className="truncate">
          Logic Triggers: If On Hand Qty falls below Sales Order requirements, the
          system will auto-generate a Purchase Order.
        </p>
      </div>
    </div>
  )
}
