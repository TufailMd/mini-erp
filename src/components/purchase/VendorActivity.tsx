import { Clock } from 'lucide-react'
import type { VendorActivityItem } from '../../types'

interface VendorActivityProps {
  activities: VendorActivityItem[]
}

export default function VendorActivity({ activities }: VendorActivityProps) {
  return (
    <div className="flex-1 rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
        <Clock className="h-4 w-4 text-slate-400" />
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Recent Vendor Activity
        </h2>
      </div>

      <div className="divide-y divide-slate-100">
        {activities.map((item) => (
          <div key={item.id} className="flex items-start gap-3 px-5 py-4">
            <span
              className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${item.dotColor}`}
            />
            <div>
              <p className="text-sm font-semibold text-slate-800">{item.text}</p>
              <p className="mt-0.5 text-xs text-slate-400">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
