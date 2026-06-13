import { ChevronRight } from 'lucide-react'

interface POBreadcrumbActionsProps {
  reference: string
  status: string
  onBackToPurchase: () => void
  onCancel: () => void
  onDownloadPDF: () => void
  onConfirm: () => void
}

export default function POBreadcrumbActions({
  reference,
  status,
  onBackToPurchase,
  onCancel,
  onDownloadPDF,
  onConfirm,
}: POBreadcrumbActionsProps) {
  const statusColor =
    status === 'Confirmed'
      ? 'text-blue-600'
      : status === 'Cancelled'
        ? 'text-red-600'
        : 'text-slate-600'

  const dotColor =
    status === 'Confirmed'
      ? 'bg-blue-500'
      : status === 'Cancelled'
        ? 'bg-red-500'
        : 'bg-green-500'

  return (
    <div className="mb-4">
      {/* Breadcrumb */}
      <div className="mb-1 flex items-center gap-1.5 text-sm text-slate-500">
        <button
          type="button"
          onClick={onBackToPurchase}
          className="transition-colors hover:text-indigo-600"
        >
          Purchase Orders
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-slate-800">{reference}</span>
      </div>

      {/* Title + Status + Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-900">{reference}</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
            <span className={`h-2 w-2 rounded-full ${dotColor}`} />
            <span className={statusColor}>{status}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel Order
          </button>
          <button
            type="button"
            onClick={onDownloadPDF}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  )
}
