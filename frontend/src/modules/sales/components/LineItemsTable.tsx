import { Package, Plus } from 'lucide-react'
import { formatCurrency } from '@/utils/formatters'
import type { LineItem } from '@/types'

interface LineItemsTableProps {
  items: LineItem[]
  onAddRow: () => void
  onProductClick: (productName: string) => void
}

export default function LineItemsTable({
  items,
  onAddRow,
  onProductClick,
}: LineItemsTableProps) {
  return (
    <div className="mt-6">
      {/* Section header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Line Items
        </h3>
        <button
          type="button"
          onClick={onAddRow}
          className="flex items-center gap-1 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Row
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Product
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                Ord. Qty
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                Del. Qty
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Cost Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Sales Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr
                key={item.id}
                className="transition-colors hover:bg-slate-50/50"
              >
                <td className="px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => onProductClick(item.product)}
                    className="flex items-center gap-2.5 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100">
                      <Package className="h-3.5 w-3.5 text-slate-500" />
                    </div>
                    {item.product}
                  </button>
                </td>
                <td className="px-4 py-3.5 text-center text-sm text-slate-700">
                  {item.orderedQty}
                </td>
                <td className="px-4 py-3.5 text-center text-sm text-slate-700">
                  {item.deliveredQty}
                </td>
                <td className="px-4 py-3.5 text-right text-sm text-slate-700">
                  {formatCurrency(item.costPrice)}
                </td>
                <td className="px-4 py-3.5 text-right text-sm text-slate-700">
                  {formatCurrency(item.salesPrice)}
                </td>
                <td className="px-4 py-3.5 text-right text-sm font-semibold text-slate-900">
                  {formatCurrency(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
