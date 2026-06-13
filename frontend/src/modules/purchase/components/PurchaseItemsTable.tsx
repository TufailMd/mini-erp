import { Package, Plus } from 'lucide-react'
import type { PurchaseItem } from '@/types'

interface PurchaseItemsTableProps {
  items: PurchaseItem[]
  untaxedAmount: number
  taxRate: number
  taxAmount: number
  total: number
  onAddProduct: () => void
}

export default function PurchaseItemsTable({
  items,
  untaxedAmount,
  taxRate,
  taxAmount,
  total,
  onAddProduct,
}: PurchaseItemsTableProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <h3 className="text-sm font-semibold text-slate-900">Purchase Items</h3>
        <button
          type="button"
          onClick={onAddProduct}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Product
              </th>
              <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Ordered
              </th>
              <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Received
              </th>
              <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                UOM
              </th>
              <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Unit Price
              </th>
              <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.iconBg}`}
                    >
                      <Package className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {item.product}
                      </p>
                      <p className="text-xs text-slate-500">{item.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-center text-sm text-slate-700">
                  {item.ordered}
                </td>
                <td className="px-4 py-4 text-center text-sm text-slate-700">
                  {item.received}
                </td>
                <td className="px-4 py-4 text-center text-sm text-slate-500">
                  {item.uom}
                </td>
                <td className="px-4 py-4 text-right text-sm text-slate-700">
                  ${item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium text-slate-900">
                  ${item.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="border-t border-slate-200 px-6 py-4">
        <div className="ml-auto w-72 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Untaxed Amount</span>
            <span className="font-medium text-slate-700">
              ${untaxedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Taxes ({taxRate}%)</span>
            <span className="font-medium text-slate-700">
              ${taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="border-t border-slate-200 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-slate-900">Total</span>
              <span className="text-base font-bold text-slate-900">
                ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
