import { LayoutGrid, Plus, Trash2 } from 'lucide-react'
import type { MOComponent, ComponentStatus } from '../../types'

interface MOComponentsTableProps {
  components: MOComponent[]
  onAddComponent: () => void
  onDeleteComponent: (id: string) => void
}

const statusBadge: Record<ComponentStatus, { bg: string; text: string; dot: string }> = {
  Available: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  'Partially Available': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  'Not Available': { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-400' },
}

export default function MOComponentsTable({
  components,
  onAddComponent,
  onDeleteComponent,
}: MOComponentsTableProps) {
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
        <button
          type="button"
          onClick={onAddComponent}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Component
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-3 pr-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Product
              </th>
              <th className="pb-3 pr-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Description
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
                  <td className="py-3 pr-4 text-sm text-slate-500">{comp.description}</td>
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
                    <button
                      type="button"
                      onClick={() => onDeleteComponent(comp.id)}
                      className="rounded-md p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              )
            })}
            {components.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sm text-slate-400">
                  No components added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
