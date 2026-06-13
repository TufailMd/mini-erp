import type { StatCardData } from '@/types'
import StatCard from '@/modules/dashboard/components/StatCard'

interface StatCardsProps {
  cards: StatCardData[]
}

export default function StatCards({ cards }: StatCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <StatCard key={card.id} card={card} />
      ))}
    </div>
  )
}
