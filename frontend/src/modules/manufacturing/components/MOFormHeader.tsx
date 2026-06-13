import { ChevronLeft, ShieldCheck, Play, CheckCircle, CheckCircle2, X } from 'lucide-react'
import type { MOStatus } from '@/types'

interface MOFormHeaderProps {
  reference: string
  status: MOStatus
  onBack: () => void
  onCheckAvailability: () => void
  onProduce: () => void
  onMarkDone: () => void
  onConfirm: () => void
  onCancel: () => void
}

const statusConfig: Record<MOStatus, { dot: string; bg: string; text: string }> = {
  Draft: { dot: 'bg-amber-400', bg: 'bg-amber-50', text: 'text-amber-700' },
  Confirmed: { dot: 'bg-blue-400', bg: 'bg-blue-50', text: 'text-blue-700' },
  'In Progress': { dot: 'bg-orange-400', bg: 'bg-orange-50', text: 'text-orange-700' },
  Done: { dot: 'bg-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  Cancelled: { dot: 'bg-red-400', bg: 'bg-red-50', text: 'text-red-700' },
}

export default function MOFormHeader({
  reference,
  status,
  onBack,
  onCheckAvailability,
  onProduce,
  onMarkDone,
  onConfirm,
  onCancel,
}: MOFormHeaderProps) {
  const cfg = statusConfig[status]

  return (
    <div className="border-b border-slate-200 bg-white px-6 py-4">
      {/* Breadcrumb */}
      <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-slate-500 transition-colors hover:text-indigo-600"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Manufacturing Orders
        </button>
        <span>/</span>
        <span className="text-slate-600">{reference}</span>
      </div>

      {/* Title row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-900">Manufacturing Order</h1>
          <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-600">
            {reference}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
            {status}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCheckAvailability}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Check Availability
          </button>
          <button
            type="button"
            onClick={onProduce}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <Play className="h-3.5 w-3.5" />
            Produce
          </button>
          <button
            type="button"
            onClick={onMarkDone}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            Mark as Done
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-700"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Confirm
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <X className="h-3.5 w-3.5" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
