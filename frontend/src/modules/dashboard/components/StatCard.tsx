import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { StatCardData } from '@/types'

interface StatCardProps {
  card: StatCardData
}

export default function StatCard({ card }: StatCardProps) {
  const Icon = card.icon
  const isAlert = card.variant === 'alert'

  const trendIcon =
    card.trendDirection === 'up' ? (
      <TrendingUp className="h-3 w-3" />
    ) : card.trendDirection === 'down' ? (
      <TrendingDown className="h-3 w-3" />
    ) : (
      <Minus className="h-3 w-3" />
    )

  const trendColor =
    card.trendDirection === 'up'
      ? 'text-emerald-600'
      : card.trendDirection === 'down'
        ? 'text-red-500'
        : 'text-gray-400'

  return (
    <div
      className={`relative rounded-xl border bg-white p-5 shadow-sm ${
        isAlert ? 'border-l-4 border-l-red-500 border-gray-100' : 'border-gray-100'
      }`}
    >
      {isAlert && (
        <span className="absolute right-3 top-3 h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
      )}

      <div className="flex items-start justify-between">
        <div className={`rounded-lg p-2 ${card.iconBg}`}>
          <Icon className={`h-5 w-5 ${card.iconColor}`} />
        </div>
        {card.trend && (
          <span className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            {trendIcon}
            {card.trend}
          </span>
        )}
      </div>

      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-gray-500">
        {card.label}
      </p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{card.value}</p>
    </div>
  )
}
