import { ChevronRight } from 'lucide-react'
import type { OrderDetailStatus } from '../../types'

interface OrderDetailHeaderProps {
  reference: string
  status: OrderDetailStatus
  onCancel: () => void
  onDeliver: () => void
  onConfirm: () => void
  onBackToSales: () => void
}

const statusBadgeClass: Record<OrderDetailStatus, string> = {
  Draft: 'bg-slate-100 text-slate-600',
  Confirmed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
  Delivered: 'bg-blue-100 text-blue-700',
}

export default function OrderDetailHeader({
  reference,
  status,
  onCancel,
  onDeliver,
  onConfirm,
  onBackToSales,
}: OrderDetailHeaderProps) {
  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      <div className="mb-2 flex items-center gap-1.5 text-sm text-slate-500">
        <button
          type="button"
          onClick={onBackToSales}
          className="hover:text-indigo-600 cursor-pointer transition-colors"
        >
          Sales
        </button>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-slate-700 font-medium">{reference}</span>
      </div>

      {/* Title row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-900">{reference}</h2>
          <span
            className={`rounded-full px-3 py-0.5 text-xs font-semibold ${statusBadgeClass[status]}`}
          >
            {status}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 active:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDeliver}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 active:bg-slate-100"
          >
            Deliver
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 active:bg-indigo-800"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  )
}
