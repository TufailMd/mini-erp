import type { AuditLogEntry } from '@/types'

interface AuditLogsTableProps {
  logs: AuditLogEntry[]
}

export default function AuditLogsTable({ logs }: AuditLogsTableProps) {
  return (
    <div className="w-full overflow-hidden border border-slate-300 bg-white">
      <table className="w-full text-left text-sm text-slate-800">
        <thead className="border-b border-slate-300">
          <tr>
            <th className="px-4 py-3 font-normal text-slate-600">Date & Time</th>
            <th className="px-4 py-3 font-normal text-slate-600 text-center">User</th>
            <th className="px-4 py-3 font-normal text-slate-600 text-center">Module</th>
            <th className="px-4 py-3 font-normal text-slate-600 text-center">Record Type</th>
            <th className="px-4 py-3 font-normal text-slate-600 text-center">Record ID</th>
            <th className="px-4 py-3 font-normal text-slate-600 text-center">Action</th>
            <th className="px-4 py-3 font-normal text-slate-600 text-center">Field Changed</th>
            <th className="px-4 py-3 font-normal text-slate-600 text-center">Old Value</th>
            <th className="px-4 py-3 font-normal text-slate-600 text-center">New Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 whitespace-nowrap">{log.dateTime}</td>
              <td className="px-4 py-3 text-center">{log.user}</td>
              <td className="px-4 py-3 text-center">{log.module}</td>
              <td className="px-4 py-3 text-center">{log.recordType}</td>
              <td className="px-4 py-3 text-center">{log.recordId}</td>
              <td className="px-4 py-3 text-center">{log.action}</td>
              <td className="px-4 py-3 text-center">{log.fieldChanged}</td>
              <td className="px-4 py-3 text-center">{log.oldValue}</td>
              <td className="px-4 py-3 text-center">{log.newValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
