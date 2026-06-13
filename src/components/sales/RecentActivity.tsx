import { Sparkles } from 'lucide-react'
import type { RecentActivityItem } from '../../types'

interface RecentActivityProps {
  activities: RecentActivityItem[]
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-indigo-500" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Recent Activity
        </h3>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id}>
            <p className="text-sm font-semibold text-slate-800">
              {activity.title}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              {activity.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
