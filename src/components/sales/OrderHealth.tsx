import { TrendingUp } from 'lucide-react'

interface OrderHealthProps {
  stockReadiness: number
  trend: string
}

export default function OrderHealth({
  stockReadiness,
  trend,
}: OrderHealthProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
        Order Health
      </h3>

      <div className="mb-1 flex items-end justify-between">
        <div>
          <span className="text-3xl font-bold text-slate-900">
            {stockReadiness}%
          </span>
          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Stock Readiness
          </p>
        </div>
        <span className="flex items-center gap-1 text-xs font-medium text-green-600">
          <TrendingUp className="h-3 w-3" />
          {trend}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-700"
          style={{ width: `${stockReadiness}%` }}
        />
      </div>
    </div>
  )
}
