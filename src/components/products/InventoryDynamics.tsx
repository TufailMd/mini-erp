import { Info } from 'lucide-react'
import type { InventoryCard } from '../../types'

interface InventoryDynamicsProps {
  cards: InventoryCard[]
}

export default function InventoryDynamics({ cards }: InventoryDynamicsProps) {
  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-5 text-lg font-bold text-slate-900">
        Inventory Dynamics
      </h3>

      <div className="grid grid-cols-2 gap-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            {/* Label */}
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {card.label}
              </p>
              {card.hasInfo && (
                <Info className="h-4 w-4 text-slate-400" />
              )}
            </div>

            {/* Value */}
            <div className="mb-3 flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${card.valueColor}`}>
                {card.value}
              </span>
              <span className="text-sm font-medium text-slate-500">
                {card.unit}
              </span>
            </div>

            {/* Breakdown */}
            <div className="space-y-1 border-t border-slate-100 pt-3">
              {card.breakdown.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-slate-500">{item.label}</span>
                  <span
                    className={`font-medium ${
                      item.isPositive === true
                        ? 'text-green-600'
                        : item.isPositive === false
                          ? 'text-red-500'
                          : 'text-slate-700'
                    }`}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
