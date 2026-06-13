import { Download, Plus } from 'lucide-react'

interface SalesPageHeaderProps {
  onExportClick: () => void
  onNewOrderClick: () => void
}

export default function SalesPageHeader({
  onExportClick,
  onNewOrderClick,
}: SalesPageHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <p className="text-xs text-slate-400">
          Sales <span className="mx-1">&gt;</span> Orders
        </p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">Sales Orders</h2>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onExportClick}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
        <button
          type="button"
          onClick={onNewOrderClick}
          className="flex items-center gap-2 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-800"
        >
          <Plus className="h-4 w-4" />
          New Sales Order
        </button>
      </div>
    </div>
  )
}
