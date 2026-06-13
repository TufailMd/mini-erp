import { Wrench, Plus, Trash2, Timer } from 'lucide-react'
import type { MOWorkOrderEntry, WOStatus } from '@/types'

interface MOWorkOrdersTableProps {
  workOrders: MOWorkOrderEntry[]
  onAddWorkOrder: () => void
  onDeleteWorkOrder: (id: string) => void
}

const statusBadge: Record<WOStatus, { bg: string; text: string; dot: string }> = {
  Pending: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  Ready: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-400' },
  'In Progress': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  Finished: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
}

export default function MOWorkOrdersTable({
  workOrders,
  onAddWorkOrder,
  onDeleteWorkOrder,
}: MOWorkOrdersTableProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50">
            <Wrench className="h-4 w-4 text-orange-600" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">Work Orders</h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
            {workOrders.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onAddWorkOrder}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Work Order
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-3 pr-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Work Center
              </th>
              <th className="pb-3 pr-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Operation
              </th>
              <th className="pb-3 pr-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Expected Duration
              </th>
              <th className="pb-3 pr-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Real Duration
              </th>
              <th className="pb-3 pr-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Status
              </th>
              <th className="pb-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                &nbsp;
              </th>
            </tr>
          </thead>
          <tbody>
            {workOrders.map((wo) => {
              const badge = statusBadge[wo.status]
              return (
                <tr key={wo.id} className="border-b border-slate-50 last:border-0">
                  <td className="py-3 pr-4 text-sm font-medium text-slate-800">{wo.workCenter}</td>
                  <td className="py-3 pr-4 text-sm text-slate-600">{wo.operation}</td>
                  <td className="py-3 pr-4 text-sm text-slate-600">{wo.expectedDuration}</td>
                  <td className="py-3 pr-4">
                    <span className="inline-flex items-center gap-1 font-mono text-sm text-slate-500">
                      <Timer className="h-3.5 w-3.5 text-slate-400" />
                      {wo.realDuration}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${badge.bg} ${badge.text}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                      {wo.status}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <button
                      type="button"
                      onClick={() => onDeleteWorkOrder(wo.id)}
                      className="rounded-md p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              )
            })}
            {workOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sm text-slate-400">
                  No work orders added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
