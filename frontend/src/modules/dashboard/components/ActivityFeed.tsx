import { ShoppingCart, Factory, AlertTriangle } from 'lucide-react'
import type { ActivityItem } from '@/types'

interface ActivityFeedProps {
  activities: ActivityItem[]
}

const typeConfig = {
  sales: { bg: 'bg-blue-100', color: 'text-blue-600', Icon: ShoppingCart },
  manufacturing: { bg: 'bg-emerald-100', color: 'text-emerald-600', Icon: Factory },
  stock: { bg: 'bg-orange-100', color: 'text-orange-600', Icon: AlertTriangle },
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-gray-900">Recent Activity</h3>
      <div className="relative space-y-0">
        {activities.map((activity, index) => {
          const config = typeConfig[activity.type]
          const Icon = config.Icon
          const isLast = index === activities.length - 1

          return (
            <div key={activity.id} className="relative flex gap-3 pb-6">
              {!isLast && (
                <span className="absolute left-4 top-8 h-full w-px bg-gray-200" />
              )}
              <div
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${config.bg}`}
              >
                <Icon className={`h-3.5 w-3.5 ${config.color}`} />
              </div>
              <div className="pt-1">
                <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                <p className="mt-0.5 text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
