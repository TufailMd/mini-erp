import type { WorkCenter } from '@/types'

interface WorkCenterCardProps {
  center: WorkCenter
}

export default function WorkCenterCard({ center }: WorkCenterCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-sm font-semibold text-slate-900">{center.name}</h3>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${center.badgeClass}`}
        >
          {center.status}
        </span>
      </div>

      <p className="mb-2 text-2xl font-bold text-slate-900">
        {center.loadPercent}%
        <span className="ml-1 text-sm font-normal text-slate-500">Load</span>
      </p>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all ${center.barColor}`}
          style={{ width: `${center.loadPercent}%` }}
        />
      </div>
    </div>
  )
}
