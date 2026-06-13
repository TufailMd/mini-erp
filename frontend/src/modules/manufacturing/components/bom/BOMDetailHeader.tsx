import { ChevronRight, Save, X, MoreVertical } from 'lucide-react'
import type { BOMStatus } from '@/types'

interface BOMDetailHeaderProps {
  reference: string
  status: BOMStatus
  onBack: () => void
  onCancel: () => void
  onSave: () => void
  onViewAudit: () => void
}

export default function BOMDetailHeader({
  reference,
  status,
  onBack,
  onCancel,
  onSave,
  onViewAudit,
}: BOMDetailHeaderProps) {
  const getStatusBadge = () => {
    switch (status) {
      case 'Active':
        return <span className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 ring-1 ring-inset ring-emerald-600/20"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>Active</span>
      case 'Draft':
        return <span className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-amber-700 bg-amber-50 ring-1 ring-inset ring-amber-600/20"><span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>Draft</span>
      case 'Archived':
        return <span className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-700 bg-slate-100 ring-1 ring-inset ring-slate-600/20"><span className="h-1.5 w-1.5 rounded-full bg-slate-500"></span>Archived</span>
      default:
        return null
    }
  }

  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex flex-col space-y-1">
        <div className="flex items-center text-sm text-slate-500">
          <button onClick={onBack} className="hover:text-indigo-600">Bill of Materials</button>
          <ChevronRight className="mx-1 h-4 w-4" />
          <span className="text-slate-900">{reference}</span>
        </div>
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-slate-900">{reference}</h1>
          {getStatusBadge()}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex rounded-lg bg-slate-100 p-1 mr-4">
          <button className="rounded-md bg-white px-4 py-1.5 text-sm font-medium text-slate-900 shadow-sm">Stock</button>
          <button className="rounded-md px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900">Route</button>
        </div>

        <button 
          onClick={onCancel}
          className="flex items-center space-x-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-red-600"
        >
          <X className="h-4 w-4" />
          <span>Cancel</span>
        </button>
        <button 
          onClick={onSave}
          className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <Save className="h-4 w-4" />
          <span>Save Record</span>
        </button>
        
        <div className="flex items-center space-x-2 border-l border-slate-200 pl-4">
          <button 
            onClick={onViewAudit}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Logs
          </button>
          <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
