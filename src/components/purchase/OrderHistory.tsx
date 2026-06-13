import { Clock, CheckCircle2 } from 'lucide-react'
import type { PurchaseOrderHistoryItem, POHistoryType } from '../../types'

interface OrderHistoryProps {
  history: PurchaseOrderHistoryItem[]
  onViewLogs?: () => void
}

function getDotColor(type: POHistoryType): string {
  switch (type) {
    case 'created':
      return 'bg-blue-500'
    case 'updated':
      return 'bg-slate-400'
    case 'notification':
      return 'bg-slate-400'
    default:
      return 'bg-slate-400'
  }
}

function getLabelColor(type: POHistoryType): string {
  switch (type) {
    case 'created':
      return 'text-blue-600'
    case 'updated':
      return 'text-slate-500'
    case 'notification':
      return 'text-slate-500'
    default:
      return 'text-slate-500'
  }
}

export default function OrderHistory({ history, onViewLogs }: OrderHistoryProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-900">Order History</h3>
        </div>
        <button
          type="button"
          onClick={onViewLogs}
          className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 transition-colors hover:text-indigo-700"
        >
          Logs
        </button>
      </div>

      {/* Timeline */}
      <div className="px-5 py-4">
        <div className="space-y-5">
          {history.map((item, index) => (
            <div key={item.id} className="relative flex gap-3">
              {/* Timeline line */}
              {index < history.length - 1 && (
                <div className="absolute left-[5px] top-3 h-full w-px bg-slate-200" />
              )}
              {/* Dot */}
              <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${getDotColor(item.type)}`} />
              {/* Content */}
              <div className="min-w-0 flex-1">
                <p className={`text-[10px] font-bold uppercase tracking-wider ${getLabelColor(item.type)}`}>
                  {item.label}
                </p>
                <p className="mt-0.5 text-xs text-slate-700">{item.description}</p>
                <p className="mt-1 text-[10px] text-slate-400">{item.date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* End of log */}
        <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4">
          <CheckCircle2 className="h-4 w-4 text-slate-300" />
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            End of Visible Log
          </p>
        </div>
      </div>
    </div>
  )
}
