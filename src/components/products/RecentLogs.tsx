import { Pencil } from 'lucide-react'
import type { ProductLog } from '../../types'

interface RecentLogsProps {
  logs: ProductLog[]
  onViewAll: () => void
}

export default function RecentLogs({ logs, onViewAll }: RecentLogsProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Recent Logs
        </h3>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-bold text-indigo-600 transition-colors hover:text-indigo-700"
        >
          View All
        </button>
      </div>

      <div className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100">
              <Pencil className="h-3.5 w-3.5 text-indigo-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800">
                {log.title}
              </p>
              <p className="text-xs text-slate-500">{log.detail}</p>
              <p className="mt-0.5 text-[10px] text-slate-400">{log.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
