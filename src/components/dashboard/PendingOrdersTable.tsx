import type { PendingOrder } from '../../types'
import LoadingSpinner from '../shared/LoadingSpinner'

interface PendingOrdersTableProps {
  orders: PendingOrder[]
  loading: boolean
  onViewAllClick: () => void
}

const statusStyles: Record<PendingOrder['status'], string> = {
  Processing: 'bg-orange-100 text-orange-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Shipped: 'bg-emerald-100 text-emerald-700',
}

export default function PendingOrdersTable({
  orders,
  loading,
  onViewAllClick,
}: PendingOrdersTableProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h3 className="text-base font-semibold text-gray-900">Pending Orders</h3>
        <button
          type="button"
          onClick={onViewAllClick}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          View All
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Customer/Vendor
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">
                    SO-2023-08{90 + Number(order.id)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{order.customer}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">{order.items}</td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-700">
                    {order.total}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
