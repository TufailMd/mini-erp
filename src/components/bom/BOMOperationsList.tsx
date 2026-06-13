import { Wrench, Trash2 } from 'lucide-react'
import type { BOMOperation } from '../../types'

interface BOMOperationsListProps {
  operations: BOMOperation[]
  onAddOperation: () => void
  onDeleteOperation: (id: string) => void
}

export default function BOMOperationsList({
  operations,
  onAddOperation,
  onDeleteOperation,
}: BOMOperationsListProps) {
  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-8">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center space-x-2">
          <Wrench className="h-5 w-5 text-indigo-500" />
          <h2 className="text-sm font-bold tracking-wider text-slate-800 uppercase">Operations</h2>
          <span className="flex h-5 items-center justify-center rounded-full bg-indigo-100 px-2 text-xs font-bold text-indigo-700">
            {operations.length}
          </span>
        </div>
        <button
          onClick={onAddOperation}
          className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100 hover:text-indigo-800"
        >
          + Add Operation
        </button>
      </div>

      <div className="p-0">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-white">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Work Center</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Operation</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Duration</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Description</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {operations.map((op) => (
              <tr key={op.id} className="transition-colors hover:bg-slate-50">
                <td className="px-6 py-3">
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                    {op.workCenter}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm font-medium text-slate-900">
                  {op.operation}
                </td>
                <td className="px-6 py-3 text-sm text-slate-600 font-medium">
                  {op.duration}
                </td>
                <td className="px-6 py-3 text-sm text-slate-500">
                  {op.description}
                </td>
                <td className="px-6 py-3 text-right">
                  <button
                    onClick={() => onDeleteOperation(op.id)}
                    className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {operations.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                  No operations defined. Click "+ Add Operation" to create routing steps.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
