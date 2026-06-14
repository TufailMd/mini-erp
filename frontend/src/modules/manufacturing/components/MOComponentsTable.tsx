import { useState } from 'react'
import { LayoutGrid, Plus, Trash2, X, Check } from 'lucide-react'
import type { MOComponent, ComponentStatus } from '@/types'
import { useErp } from '@/context/ErpContext'

interface MOComponentsTableProps {
  components: MOComponent[]
  isDraft?: boolean
  onAddComponent: (comp: { productId: string; qty: number; units: string }) => void
  onDeleteComponent: (id: string) => void
}

const statusBadge: Record<ComponentStatus, { bg: string; text: string; dot: string }> = {
  Available: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  'Partially Available': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  'Not Available': { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-400' },
}

export default function MOComponentsTable({
  components,
  isDraft = false,
  onAddComponent,
  onDeleteComponent,
}: MOComponentsTableProps) {
  const { products } = useErp()

  const [adding, setAdding] = useState(false)
  const [newProductId, setNewProductId] = useState(products[0]?.id || '')
  const [newQty, setNewQty] = useState(1)
  const [newUnit, setNewUnit] = useState('Units')

  const handleAdd = () => {
    if (!newProductId || newQty <= 0) return
    onAddComponent({ productId: newProductId, qty: newQty, units: newUnit })
    setAdding(false)
    setNewQty(1)
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
            <LayoutGrid className="h-4 w-4 text-indigo-600" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">Components</h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
            {components.length}
          </span>
        </div>
        {isDraft && !adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Component
          </button>
        )}
      </div>

      {/* Inline add row */}
      {isDraft && adding && (
        <div className="mb-4 flex items-end gap-3 rounded-lg border border-indigo-100 bg-indigo-50/60 p-3">
          <div className="flex-1">
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Product
            </label>
            <select
              value={newProductId}
              onChange={e => setNewProductId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.code})
                </option>
              ))}
            </select>
          </div>
          <div className="w-24">
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Qty
            </label>
            <input
              type="number"
              min={1}
              value={newQty}
              onChange={e => setNewQty(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none"
            />
          </div>
          <div className="w-24">
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Unit
            </label>
            <select
              value={newUnit}
              onChange={e => setNewUnit(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none"
            >
              {['Units', 'Kg', 'Litres', 'Meters', 'Pieces'].map(u => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-lg bg-indigo-600 p-2 text-white hover:bg-indigo-700"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setAdding(false)}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-3 pr-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Product
              </th>
              <th className="pb-3 pr-4 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Quantity
              </th>
              <th className="pb-3 pr-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                UOM
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
            {components.map((comp) => {
              const badge = statusBadge[comp.status]
              return (
                <tr key={comp.id} className="border-b border-slate-50 last:border-0">
                  <td className="py-3 pr-4 text-sm font-medium text-slate-800">{comp.product}</td>
                  <td className="py-3 pr-4 text-right text-sm font-semibold text-slate-800">
                    {comp.quantity}
                  </td>
                  <td className="py-3 pr-4 text-sm text-slate-500">{comp.uom}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${badge.bg} ${badge.text}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                      {comp.status}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    {isDraft && (
                      <button
                        type="button"
                        onClick={() => onDeleteComponent(comp.id)}
                        className="rounded-md p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
            {components.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-slate-400">
                  {isDraft
                    ? 'No components yet — click "Add Component" or select a BOM above'
                    : 'No components added'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
