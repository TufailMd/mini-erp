import { Sparkles, CheckCircle2, Circle } from 'lucide-react'
import type { TimelineStep, TimelineStatus } from '@/types'

interface OrderTimelineProps {
  steps: TimelineStep[]
}

function getStepIcon(status: TimelineStatus) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />
    case 'current':
      return (
        <div className="flex h-5 w-5 items-center justify-center">
          <div className="h-5 w-5 rounded-full border-[3px] border-indigo-500 bg-white" />
        </div>
      )
    case 'pending':
      return <Circle className="h-5 w-5 text-slate-300" />
  }
}

export default function OrderTimeline({ steps }: OrderTimelineProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-indigo-500" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Order Timeline
        </h3>
      </div>

      <div className="relative space-y-0">
        {steps.map((step, index) => (
          <div key={step.id} className="relative flex gap-3 pb-5 last:pb-0">
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="absolute left-[9px] top-6 h-full w-px bg-slate-200" />
            )}

            {/* Icon */}
            <div className="relative z-10 shrink-0">{getStepIcon(step.status)}</div>

            {/* Content */}
            <div className="min-w-0 pt-0.5">
              <p
                className={`text-sm font-semibold ${
                  step.status === 'pending'
                    ? 'text-slate-400'
                    : 'text-slate-800'
                }`}
              >
                {step.label}
              </p>
              <p
                className={`text-xs ${
                  step.status === 'pending'
                    ? 'text-slate-300'
                    : 'text-slate-500'
                }`}
              >
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
