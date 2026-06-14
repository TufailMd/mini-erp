import { useEffect, useMemo, useState } from 'react'

import ErpSidebar from '@/components/layout/ErpSidebar'
import AuditLogsHeader from '@/modules/audit/components/AuditLogsHeader'
import AuditLogsFilterBar from '@/modules/audit/components/AuditLogsFilterBar'
import AuditLogsTable from '@/modules/audit/components/AuditLogsTable'
import { erpNavItems, erpFooterNavItems } from '@/constants/navigation'
import type { PageProps, AuditLogEntry } from '@/types'
import { useAuth } from '@/context/AuthContext'

type AuditLogFilters = {
  module?: string
  record_id?: string
  page?: number
  limit?: number
}


export default function AuditLogsPage({ activePage, onNavigate }: PageProps) {
  const { user } = useAuth()

  const [filters] = useState<AuditLogFilters>({
    module: undefined,
    record_id: undefined,
    page: 1,
    limit: 50,
  })



  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [total, setTotal] = useState(0)

  const handleNewRecordClick = () => {
    onNavigate('dashboard')
  }

  // Load audit logs from backend (real data)
  // NOTE: apiClient already unwraps { success, data } → so the resolved value IS the data array.
  // The backend for audit-logs returns { success, data: [...], total } — apiClient strips the
  // wrapper and returns data[] directly. We need total separately, so we use axios directly
  // via a raw interceptor bypass using a custom response interceptor that keeps the full body.
  useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        if (filters.module) params.set('module', filters.module)
        if (filters.record_id) params.set('record_id', filters.record_id)
        if (filters.page) params.set('page', String(filters.page))
        if (filters.limit) params.set('limit', String(filters.limit))

        // Use fetch directly to bypass apiClient's unwrapping interceptor
        const token = localStorage.getItem('token') || ''
        const response = await fetch(
          `http://localhost:5000/api/audit-logs?${params.toString()}`,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        )

        if (cancelled) return

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}))
          throw new Error(errBody?.message || `HTTP ${response.status}`)
        }

        const body = await response.json()
        const backendLogs: any[] = Array.isArray(body?.data) ? body.data : []

        setLogs(
          backendLogs.map((l) => {
            const id = String(l._id ?? l.id ?? '')
            const moduleName = l.module ?? l.entity ?? 'Unknown'
            const recordIdRaw = l.record_reference ?? l.record_id ?? l.entityId ?? l.recordId

            return {
              id,
              dateTime: new Date(l.createdAt ?? l.dateTime ?? Date.now()).toLocaleString(),
              user: l.user?.name ?? l.user?.email ?? 'System',
              action: l.action ?? l.action_type ?? 'UNKNOWN',
              module: moduleName,
              recordType: moduleName,
              recordId: recordIdRaw ? String(recordIdRaw) : '-',
              fieldChanged: l.field_changed ?? l.fieldChanged ?? '-',
              oldValue: String(l.old_value ?? l.oldValue ?? '-'),
              newValue: String(l.new_value ?? l.newValue ?? '-'),
            } satisfies AuditLogEntry
          })
        )

        setTotal(body?.total ?? backendLogs.length)

      } catch (e: any) {
        if (cancelled) return
        setError(e?.message || 'Failed to fetch audit logs')
        setLogs([])
        setTotal(0)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [filters.page, filters.limit, filters.module, filters.record_id])

  const stats = useMemo(
    () => ({
      total,
      created: logs.filter((l) => /create/i.test(l.action)).length,
      updated: logs.filter((l) => /update/i.test(l.action)).length,
      deleted: logs.filter((l) => /delete/i.test(l.action)).length,
    }),
    [logs, total]
  )

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <ErpSidebar
        navItems={erpNavItems}
        footerItems={erpFooterNavItems}
        activePage={activePage}
        onNavigate={onNavigate}
        onNewRecordClick={handleNewRecordClick}
        userName={user?.email ?? 'Admin'}
        userRole={String(user?.role ?? 'ADMIN')}
        userInitials={(user?.email ?? 'A').slice(0, 2).toUpperCase()}
      />

      <div className="ml-60 flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <h1 className="text-lg font-bold text-slate-900">Audit Logs</h1>
          <p className="text-sm text-slate-500 italic">Backend-powered audit trail</p>
        </header>

        <main className="flex-1 p-6 bg-white m-6 border border-slate-300 rounded shadow-sm">
          <AuditLogsHeader stats={stats} />

          {/* Filter bar can stay, but it must not rely on hardcoded options. */}
          {/* If AuditLogsFilterBar supports onChange, we will wire it next. For now it only renders UI. */}
          <AuditLogsFilterBar
            options={{
              users: [],
              modules: [],
              actions: [],
            }}
          />

          {error ? (
            <div className="mt-4 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <AuditLogsTable logs={logs} loading={loading} />

        </main>
      </div>
    </div>
  )
}

