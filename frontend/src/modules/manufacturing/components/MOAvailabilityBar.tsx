import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import type { MOComponent } from '@/types'

interface MOAvailabilityBarProps {
  availability: 'available' | 'partial' | 'unavailable'
  components: MOComponent[]
}

export default function MOAvailabilityBar({ availability, components }: MOAvailabilityBarProps) {
  const availableCount = components.filter((c) => c.status === 'Available').length
  const totalCount = components.length

  const config = {
    available: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      barBg: 'bg-emerald-100',
      barFill: 'bg-emerald-500',
      text: 'text-emerald-700',
      icon: CheckCircle,
      iconColor: 'text-emerald-500',
      label: 'All Components Available',
      description: `${availableCount} of ${totalCount} components available`,
      fillPercent: 100,
    },
    partial: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      barBg: 'bg-amber-100',
      barFill: 'bg-amber-500',
      text: 'text-amber-700',
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
      label: 'Partially Available',
      description: `${availableCount} of ${totalCount} components available`,
      fillPercent: totalCount > 0 ? Math.round((availableCount / totalCount) * 100) : 0,
    },
    unavailable: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      barBg: 'bg-red-100',
      barFill: 'bg-red-500',
      text: 'text-red-700',
      icon: XCircle,
      iconColor: 'text-red-500',
      label: 'Components Unavailable',
      description: `${availableCount} of ${totalCount} components available`,
      fillPercent: totalCount > 0 ? Math.round((availableCount / totalCount) * 100) : 0,
    },
  }

  const cfg = config[availability]
  const Icon = cfg.icon

  return (
    <div className={`rounded-xl border ${cfg.border} ${cfg.bg} p-4`}>
      <div className="flex items-center gap-3">
        <Icon className={`h-5 w-5 shrink-0 ${cfg.iconColor}`} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className={`text-sm font-semibold ${cfg.text}`}>{cfg.label}</span>
            <span className={`text-xs font-medium ${cfg.text}`}>{cfg.description}</span>
          </div>
          <div className={`mt-2 h-2 w-full overflow-hidden rounded-full ${cfg.barBg}`}>
            <div
              className={`h-full rounded-full ${cfg.barFill} transition-all duration-500`}
              style={{ width: `${cfg.fillPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
