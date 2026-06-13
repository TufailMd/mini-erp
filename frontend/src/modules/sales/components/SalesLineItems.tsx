import { LayoutGrid, Plus, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/utils/formatters'
import type { CreateLineItem } from '@/types'

interface SalesLineItemsProps {
  items: CreateLineItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  onAddRow: () => void
  onDeleteRow: (id: string) => void
}

function formatQty(qty: number): string {
  return qty.toFixed(2)
}

export default function SalesLineItems({
  items,
  subtotal,
  taxRate,
  taxAmount,
  total,
  onAddRow,
  onDeleteRow,
}: SalesLineItemsProps) {
  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <LayoutGrid className="h-5 w-5 text-indigo-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Line Items
          </h3>
        </div>
        <button
          type="button"
          onClick={onAddRow}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Row
        </button>
      </div>

      {/* Table */}
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/60">
            <th className="w-12 px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              #
            </th>
            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Product
            </th>
            <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Ord. Qty
            </th>
            <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Del. Qty
            </th>
            <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Unit Price
            </th>
            <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Total
            </th>
            <th className="w-12 px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => (
            <tr
              key={item.id}
              className="transition-colors hover:bg-slate-50/50"
            >
              <td className="px-4 py-4 text-center text-sm text-slate-500">
                {item.rowNum}
              </td>
              <td className="px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">
                  {item.product}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  SKU: {item.sku}
                </p>
              </td>
              <td className="px-4 py-4 text-center text-sm text-slate-700">
                {formatQty(item.orderedQty)}
              </td>
              <td className="px-4 py-4 text-center text-sm text-slate-700">
                {formatQty(item.deliveredQty)}
              </td>
              <td className="px-4 py-4 text-right text-sm text-slate-700">
                {formatCurrency(item.unitPrice)}
              </td>
              <td className="px-4 py-4 text-right">
                <span className="text-sm font-bold text-indigo-600">
                  {formatCurrency(item.total)}
                </span>
              </td>
              <td className="px-4 py-4 text-center">
                <button
                  type="button"
                  onClick={() => onDeleteRow(item.id)}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="border-t border-slate-200 px-6 py-4">
        <div className="flex justify-end">
          <div className="w-72 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-medium text-slate-700">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Tax ({taxRate}%)</span>
              <span className="font-medium text-slate-700">
                {formatCurrency(taxAmount)}
              </span>
            </div>
            <div className="border-t border-slate-200 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">Total</span>
                <span className="text-lg font-bold text-indigo-600">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
