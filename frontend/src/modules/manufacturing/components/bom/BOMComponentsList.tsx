import { Layers, Trash2 } from 'lucide-react'
import type { BOMComponent } from '@/types'

interface BOMComponentsListProps {
  components: BOMComponent[]
  onAddComponent: () => void
  onDeleteComponent: (id: string) => void
}

export default function BOMComponentsList({
  components,
  onAddComponent,
  onDeleteComponent,
}: BOMComponentsListProps) {
  const totalCost = components.reduce((sum, comp) => sum + (comp.quantity * comp.cost), 0)

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center space-x-2">
          <Layers className="h-5 w-5 text-indigo-500" />
          <h2 className="text-sm font-bold tracking-wider text-slate-800 uppercase">Components</h2>
          <span className="flex h-5 items-center justify-center rounded-full bg-indigo-100 px-2 text-xs font-bold text-indigo-700">
            {components.length}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium text-slate-600">
            Total Cost: <span className="text-slate-900">₹{totalCost.toFixed(2)}</span>
          </div>
          <button
            onClick={onAddComponent}
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100 hover:text-indigo-800"
          >
            + Add Product
          </button>
        </div>
      </div>

      <div className="p-0">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-white">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Product</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Quantity</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">UoM</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Est. Cost</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {components.map((comp) => (
              <tr key={comp.id} className="transition-colors hover:bg-slate-50">
                <td className="px-6 py-3">
                  <div className="text-sm font-medium text-slate-900">{comp.product}</div>
                  <div className="text-xs text-slate-500">{comp.description}</div>
                </td>
                <td className="px-6 py-3 text-sm text-slate-900 font-medium">
                  {comp.quantity}
                </td>
                <td className="px-6 py-3 text-sm text-slate-600">
                  {comp.uom}
                </td>
                <td className="px-6 py-3 text-sm text-slate-900 font-medium">
                  ₹{(comp.cost * comp.quantity).toFixed(2)}
                  <div className="text-xs text-slate-400 font-normal">₹{comp.cost.toFixed(2)} / {comp.uom}</div>
                </td>
                <td className="px-6 py-3 text-right">
                  <button
                    onClick={() => onDeleteComponent(comp.id)}
                    className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {components.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                  No components added yet. Click "+ Add Product" to begin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="bg-amber-50/50 p-3 text-center border-t border-slate-200">
        <p className="text-xs text-amber-700">💡 All fields of line should be populated on manufacturing order if BOM is selected on manufacturing order</p>
      </div>
    </div>
  )
}
