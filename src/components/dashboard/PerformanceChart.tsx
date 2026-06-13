import type { ChartDataPoint, ChartPeriod } from '../../types'
import LoadingSpinner from '../shared/LoadingSpinner'

interface PerformanceChartProps {
  data: ChartDataPoint[]
  period: ChartPeriod
  loading: boolean
  onPeriodChange: (period: ChartPeriod) => void
}

export default function PerformanceChart({
  data,
  period,
  loading,
  onPeriodChange,
}: PerformanceChartProps) {
  const maxValue = Math.max(...data.map((d) => d.base + d.top))

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Operational Performance
          </h3>
          <p className="mt-0.5 text-sm text-gray-500">
            Weekly throughput across all modules
          </p>
        </div>

        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => onPeriodChange('weekly')}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              period === 'weekly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Weekly
          </button>
          <button
            type="button"
            onClick={() => onPeriodChange('monthly')}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              period === 'monthly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex h-48 items-end justify-between gap-3">
          {data.map((point) => {
            const total = point.base + point.top
            const heightPercent = (total / maxValue) * 100
            const basePercent = (point.base / total) * 100

            return (
              <div key={point.day} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="flex w-full max-w-[40px] flex-col justify-end rounded-t-md overflow-hidden"
                  style={{ height: `${heightPercent}%`, minHeight: '20px' }}
                >
                  <div
                    className="w-full bg-blue-400"
                    style={{ height: `${100 - basePercent}%` }}
                  />
                  <div
                    className="w-full bg-blue-200"
                    style={{ height: `${basePercent}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{point.day}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
