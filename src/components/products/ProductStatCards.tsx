import { TrendingUp } from 'lucide-react'
import type { ProductStatCardData } from '../../types'

interface ProductStatCardsProps {
  cards: ProductStatCardData[]
}

export default function ProductStatCards({ cards }: ProductStatCardsProps) {
  return (
    <div className="mb-6 grid grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`rounded-xl border bg-white px-5 py-4 transition-shadow hover:shadow-md ${
            card.variant === 'efficiency'
              ? 'border-indigo-200'
              : 'border-slate-200'
          }`}
        >
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {card.label}
          </p>
          <div className="flex items-end gap-3">
            <span
              className={`text-2xl font-bold ${
                card.variant === 'critical'
                  ? 'text-red-600'
                  : card.variant === 'efficiency'
                    ? 'text-indigo-600'
                    : 'text-slate-900'
              }`}
            >
              {card.value}
            </span>

            {/* Sub-value rendering based on variant */}
            {card.variant === 'critical' ? (
              <span className={card.subValueClass}>{card.subValue}</span>
            ) : card.variant === 'money' ? (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <TrendingUp className="h-3 w-3 text-green-500" />
                {card.subValue}
              </span>
            ) : (
              <span className={`text-sm font-medium ${card.subValueClass}`}>
                {card.subValue}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
