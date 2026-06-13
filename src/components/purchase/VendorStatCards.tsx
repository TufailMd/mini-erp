import { Users, FileText, Clock, Award } from 'lucide-react'
import type { VendorStatCardData } from '../../types'

interface VendorStatCardsProps {
  cards: VendorStatCardData[]
}

const iconMap = [Users, FileText, Clock, Award]

export default function VendorStatCards({ cards }: VendorStatCardsProps) {
  return (
    <div className="mb-6 grid grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = iconMap[idx] ?? Users
        return (
          <div
            key={card.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {card.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{card.value}</p>
                <p className={`mt-0.5 text-xs font-medium ${card.subClass}`}>
                  {card.sub}
                </p>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.iconClass}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
