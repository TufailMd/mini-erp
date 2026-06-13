import type { RecordMetadata } from '../../types'

interface RecordInfoProps {
  record: RecordMetadata
}

export default function RecordInfo({ record }: RecordInfoProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Key-value pairs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Record Lifecycle</span>
          <span className="text-sm font-semibold text-slate-800">
            {record.lifecycle}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Last Audit</span>
          <span className="text-sm font-semibold text-slate-800">
            {record.lastAudit}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Created By</span>
          <span className="text-sm font-semibold text-slate-800">
            {record.createdBy}
          </span>
        </div>
      </div>

      {/* Inventory Health */}
      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Inventory Health
        </p>
        <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-700"
            style={{ width: `${record.inventoryHealth}%` }}
          />
        </div>
        <p className="text-xs italic text-slate-400">
          {record.healthDescription}
        </p>
      </div>
    </div>
  )
}
