import type { ManufacturingOrder } from '@/types'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

interface ManufacturingListProps {
  orders: ManufacturingOrder[]
  loading: boolean
  onRowClick: (orderId: string) => void
}

const columnLabels: Record<ManufacturingOrder['columnId'], string> = {
  draft: 'Draft',
  planned: 'Planned',
  'in-progress': 'In Progress',
}

export default function ManufacturingList({
  orders,
  loading,
  onRowClick,
}: ManufacturingListProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Reference
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                BOM
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Qty
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Progress
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr
                key={order.id}
                onClick={() => onRowClick(order.id)}
                className="cursor-pointer transition-colors hover:bg-slate-50/50"
              >
                <td className="px-6 py-4 text-sm font-medium text-indigo-600">
                  {order.reference}
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">{order.title}</td>
                <td className="px-4 py-4 text-sm text-slate-500">{order.bom}</td>
                <td className="px-4 py-4 text-sm text-slate-700">
                  {order.quantity.toLocaleString()}
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                    {columnLabels[order.columnId]}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">
                  {order.progress !== undefined ? `${order.progress}%` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
