import { Map } from 'lucide-react'

export default function SupplierHeatmap() {
  return (
    <div className="flex-1 rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Global Supplier Heatmap
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Visualize supplier distribution and lead times across regions
        </p>
      </div>

      <div className="flex flex-col items-center justify-center px-5 py-12">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <Map className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Click to Interact with Map
        </p>
      </div>
    </div>
  )
}
