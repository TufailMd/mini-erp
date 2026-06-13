import { FileText, CheckCircle2, Layers, BarChart3 } from 'lucide-react'

interface StatCard {
  id: string
  label: string
  value: string
  sub: string
  subClass: string
  iconClass: string
}

export default function BOMStatCards({ cards }: { cards: StatCard[] }) {
  const getIcon = (id: string, className: string) => {
    switch (id) {
      case '1':
        return <FileText className={`h-6 w-6 ${className}`} />
      case '2':
        return <CheckCircle2 className={`h-6 w-6 ${className}`} />
      case '3':
        return <Layers className={`h-6 w-6 ${className}`} />
      case '4':
        return <BarChart3 className={`h-6 w-6 ${className}`} />
      default:
        return <FileText className={`h-6 w-6 ${className}`} />
    }
  }

  return (
    <div className="mb-6 grid grid-cols-4 gap-6">
      {cards.map((card) => (
        <div key={card.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{card.label}</p>
            <div className="mt-2 flex items-baseline space-x-2">
              <h2 className="text-2xl font-bold text-slate-900">{card.value}</h2>
              <span className={`text-sm font-medium ${card.subClass}`}>{card.sub}</span>
            </div>
          </div>
          <div className={`rounded-lg bg-slate-50 p-3 ${card.iconClass}`}>
            {getIcon(card.id, '')}
          </div>
        </div>
      ))}
    </div>
  )
}
