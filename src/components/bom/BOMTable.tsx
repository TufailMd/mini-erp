import { Package, Wrench } from 'lucide-react'
import type { BOMListItem } from '../../types'

interface BOMTableProps {
  items: BOMListItem[]
  loading: boolean
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onToggleSelectAll: () => void
  onBomClick: (id: string) => void
}

export default function BOMTable({
  items,
  loading,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onBomClick,
}: BOMTableProps) {
  const allSelected = items.length > 0 && selectedIds.length === items.length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">Active</span>
      case 'Draft':
        return <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">Draft</span>
      case 'Archived':
        return <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-600/20">Archived</span>
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="mt-4 text-sm text-slate-500">Loading bill of materials...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                />
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Reference</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Product</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Qty</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Components</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Operations</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Status</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Modified</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Created By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {items.map((item) => (
              <tr 
                key={item.id} 
                className="group cursor-pointer transition-colors hover:bg-slate-50"
                onClick={() => onBomClick(item.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => onToggleSelect(item.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-mono text-sm font-medium text-indigo-600 group-hover:text-indigo-700">{item.reference}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900">{item.product}</span>
                    <span className="text-xs text-slate-500">{item.productCode}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{item.quantity} <span className="text-xs text-slate-500">{item.uom}</span></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-slate-600">
                    <Package className="mr-1.5 h-4 w-4 text-slate-400" />
                    {item.componentCount}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-slate-600">
                    <Wrench className="mr-1.5 h-4 w-4 text-slate-400" />
                    {item.operationCount}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(item.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-600">{item.lastModified}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-medium text-slate-600">
                      {item.createdBy.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm text-slate-600">{item.createdBy}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
