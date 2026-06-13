import { BarChart3, Layers, Wrench, Clock, ShieldCheck } from 'lucide-react'
import type { MOStatus, MOComponent, MOWorkOrderEntry } from '@/types'

interface MOProgressPanelProps {
  status: MOStatus
  producedQty: number
  quantityToProduce: number
  uom: string
  consumedQty: number
  components: MOComponent[]
  workOrders: MOWorkOrderEntry[]
  availability: 'available' | 'partial' | 'unavailable'
}

const timelineSteps: MOStatus[] = ['Draft', 'Confirmed', 'In Progress', 'Done']

const statusOrder: Record<MOStatus, number> = {
  Draft: 0,
  Confirmed: 1,
  'In Progress': 2,
  Done: 3,
  Cancelled: -1,
}

function parseDuration(dur: string): number {
  const match = dur.match(/(\d+)h\s*(\d+)m/)
  if (!match) return 0
  return parseInt(match[1], 10) * 60 + parseInt(match[2], 10)
}

function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h}h ${String(m).padStart(2, '0')}m`
}

export default function MOProgressPanel({
  status,
  producedQty,
  quantityToProduce,
  uom,
  consumedQty,
  components,
  workOrders,
  availability,
}: MOProgressPanelProps) {
  const progressPercent =
    quantityToProduce > 0 ? Math.round((producedQty / quantityToProduce) * 100) : 0

  const currentStepIdx = statusOrder[status]
  const isCancelled = status === 'Cancelled'

  const totalExpectedMinutes = workOrders.reduce(
    (sum, wo) => sum + parseDuration(wo.expectedDuration),
    0,
  )

  const availabilityBadge = {
    available: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Available' },
    partial: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Partial' },
    unavailable: { bg: 'bg-red-50', text: 'text-red-700', label: 'Unavailable' },
  }

  const avBadge = availabilityBadge[availability]

  return (
    <div className="space-y-4">
      {/* Production Progress */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
          <BarChart3 className="h-4 w-4 text-indigo-600" />
          Production Progress
        </h3>

        {/* Produced */}
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Produced
            </span>
            <span className="text-xs font-semibold text-slate-700">
              {producedQty} / {quantityToProduce} {uom}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Consumed */}
        <div className="mb-5 rounded-lg bg-slate-50 px-3 py-2">
          <span className="text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{consumedQty} {uom}</span> consumed
          </span>
        </div>

        {/* Status Timeline */}
        <div className="space-y-0">
          {timelineSteps.map((step, idx) => {
            const isCompleted = !isCancelled && currentStepIdx >= idx
            const isCurrent = !isCancelled && currentStepIdx === idx
            const isFuture = isCancelled || currentStepIdx < idx

            return (
              <div key={step} className="flex items-start gap-3">
                {/* Dot + line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`h-3 w-3 rounded-full border-2 ${
                      isCurrent
                        ? 'border-indigo-600 bg-indigo-600'
                        : isCompleted
                          ? 'border-emerald-500 bg-emerald-500'
                          : 'border-slate-300 bg-white'
                    }`}
                  />
                  {idx < timelineSteps.length - 1 && (
                    <div
                      className={`h-6 w-0.5 ${
                        isCompleted && !isCurrent ? 'bg-emerald-300' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
                {/* Label */}
                <span
                  className={`text-xs font-medium ${
                    isCurrent
                      ? 'text-indigo-700'
                      : isCompleted
                        ? 'text-emerald-600'
                        : isFuture
                          ? 'text-slate-400'
                          : 'text-slate-600'
                  }`}
                >
                  {step}
                </span>
              </div>
            )
          })}

          {isCancelled && (
            <div className="mt-2 flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className="h-3 w-3 rounded-full border-2 border-red-500 bg-red-500" />
              </div>
              <span className="text-xs font-medium text-red-600">Cancelled</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="mb-4 text-sm font-bold text-slate-900">Quick Stats</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs text-slate-500">
              <Layers className="h-3.5 w-3.5 text-slate-400" />
              Total Components
            </span>
            <span className="text-xs font-semibold text-slate-800">{components.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs text-slate-500">
              <Wrench className="h-3.5 w-3.5 text-slate-400" />
              Work Orders
            </span>
            <span className="text-xs font-semibold text-slate-800">{workOrders.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              Expected Time
            </span>
            <span className="text-xs font-semibold text-slate-800">
              {formatMinutes(totalExpectedMinutes)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
              Availability
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${avBadge.bg} ${avBadge.text}`}
            >
              {avBadge.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
