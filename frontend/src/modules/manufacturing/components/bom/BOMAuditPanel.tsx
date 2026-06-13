import { History } from 'lucide-react'
import type { BOMDetailData } from '@/types'

interface BOMAuditPanelProps {
  data: BOMDetailData
}

export default function BOMAuditPanel({ data }: BOMAuditPanelProps) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700'
      case 'Draft': return 'bg-amber-100 text-amber-700'
      case 'Archived': return 'bg-slate-100 text-slate-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const totalMaterialCost = data.components.reduce((sum, c) => sum + (c.cost * c.quantity), 0)

  // Parse durations like "4h 30m" and sum them up
  const calculateTotalDuration = () => {
    let totalMinutes = 0
    data.operations.forEach(op => {
      const hoursMatch = op.duration.match(/(\d+)h/)
      const minsMatch = op.duration.match(/(\d+)m/)
      
      if (hoursMatch) totalMinutes += parseInt(hoursMatch[1]) * 60
      if (minsMatch) totalMinutes += parseInt(minsMatch[1])
    })
    
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="w-80 flex-shrink-0 space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-xs font-bold tracking-wider text-slate-500 uppercase">BOM Information</h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-slate-500">Created By</p>
            <p className="font-medium text-slate-900">{data.createdBy}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Created Date</p>
            <p className="font-medium text-slate-900">{data.createdDate}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Last Modified</p>
            <p className="font-medium text-slate-900">{data.lastModified}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Status</p>
            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusColor(data.status)}`}>
              {data.status}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-xs font-bold tracking-wider text-slate-500 uppercase">Cost & Time Summary</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <span className="text-sm text-slate-600">Material Cost</span>
            <span className="font-semibold text-slate-900">₹{totalMaterialCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <span className="text-sm text-slate-600">Total Operations</span>
            <span className="font-semibold text-slate-900">{data.operations.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Total Est. Duration</span>
            <span className="font-semibold text-slate-900">{calculateTotalDuration()}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="h-4 w-4 text-slate-400" />
            <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase">Audit History</h3>
          </div>
          <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700">View All</button>
        </div>
        
        <div className="relative space-y-4 before:absolute before:inset-0 before:ml-2 before:-translate-x-px before:border-l-2 before:border-slate-200 before:content-['']">
          {data.auditLogs.map((log, index) => (
            <div key={log.id} className="relative flex items-start space-x-3">
              <div className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ring-4 ring-white ${index === 0 ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              </div>
              <div>
                <p className={`text-sm font-medium ${index === 0 ? 'text-slate-900' : 'text-slate-700'}`}>
                  {log.action}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {log.user} • {log.date}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 border-t border-slate-100 pt-3 flex justify-between items-center">
            <p className="text-xs text-slate-400">Shows Audit Logs of Bill of Material</p>
        </div>
      </div>
    </div>
  )
}
