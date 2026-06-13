interface AuditLogsHeaderProps {
  stats: {
    total: number
    created: number
    updated: number
    deleted: number
  }
}

export default function AuditLogsHeader({ stats }: AuditLogsHeaderProps) {
  return (
    <div className="mb-6 grid grid-cols-4 gap-4">
      {/* Total Logs */}
      <div className="flex flex-col items-center justify-center rounded-lg border border-slate-300 bg-sky-200 py-6 text-center shadow-sm">
        <h3 className="text-sm font-medium text-slate-800">Total Logs</h3>
        <p className="text-3xl font-normal text-slate-900">{stats.total}</p>
        <p className="mt-1 text-xs text-slate-700">All time logs</p>
      </div>

      {/* Create Actions */}
      <div className="flex flex-col items-center justify-center rounded-lg border border-slate-300 bg-green-600 py-6 text-center shadow-sm text-white">
        <h3 className="text-sm font-medium">Create Actions</h3>
        <p className="text-3xl font-normal">{stats.created}</p>
        <p className="mt-1 text-xs">Records Created</p>
      </div>

      {/* Update Actions */}
      <div className="flex flex-col items-center justify-center rounded-lg border border-slate-300 bg-orange-400 py-6 text-center shadow-sm text-slate-900">
        <h3 className="text-sm font-medium">Update Actions</h3>
        <p className="text-3xl font-normal">{stats.updated}</p>
        <p className="mt-1 text-xs">Records Updated</p>
      </div>

      {/* Delete Actions */}
      <div className="flex flex-col items-center justify-center rounded-lg border border-slate-300 bg-red-400 py-6 text-center shadow-sm text-white">
        <h3 className="text-sm font-medium text-slate-900">Delete Actions</h3>
        <p className="text-3xl font-normal text-slate-900">{stats.deleted}</p>
        <p className="mt-1 text-xs text-slate-900">Records Deleted</p>
      </div>
    </div>
  )
}
