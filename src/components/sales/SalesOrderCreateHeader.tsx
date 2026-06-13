import { ArrowLeft, X, Truck, CheckCircle2 } from 'lucide-react'

interface SalesOrderCreateHeaderProps {
  reference: string
  status: string
  onBack: () => void
  onCancel: () => void
  onDeliver: () => void
  onConfirm: () => void
}

export default function SalesOrderCreateHeader({
  reference,
  status,
  onBack,
  onCancel,
  onDeliver,
  onConfirm,
}: SalesOrderCreateHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-slate-900">Sales Order</h1>
        <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-semibold text-slate-700">
          {reference}
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          {status}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
        <button
          type="button"
          onClick={onDeliver}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <Truck className="h-4 w-4" />
          Deliver
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-800"
        >
          <CheckCircle2 className="h-4 w-4" />
          Confirm
        </button>
      </div>
    </header>
  )
}
