import { AlertTriangle, Clock } from 'lucide-react'
import type { StockAlert } from '../../types'

interface AlertsSectionProps {
  alerts: StockAlert[]
}

const severityConfig = {
  critical: {
    bg: 'bg-red-50',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    Icon: AlertTriangle,
  },
  delayed: {
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    Icon: Clock,
  },
}

export default function AlertsSection({ alerts }: AlertsSectionProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-gray-900">Stock Alerts</h3>
      <div className="space-y-3">
        {alerts.map((alert) => {
          const config = severityConfig[alert.severity]
          const Icon = config.Icon
          return (
            <div
              key={alert.id}
              className={`flex gap-3 rounded-lg p-4 ${config.bg}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.iconBg}`}
              >
                <Icon className={`h-4 w-4 ${config.iconColor}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{alert.title}</p>
                <p className="mt-0.5 text-xs text-gray-600">{alert.message}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
