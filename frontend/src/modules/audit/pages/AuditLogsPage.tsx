import ErpSidebar from '@/modules/sales/components/ErpSidebar'
import AuditLogsHeader from '@/modules/audit/components/AuditLogsHeader'
import AuditLogsFilterBar from '@/modules/audit/components/AuditLogsFilterBar'
import AuditLogsTable from '@/modules/audit/components/AuditLogsTable'
import { erpNavItems, erpFooterNavItems } from '@/data/salesData'
import { filterOptions } from '@/data/auditLogsData'
import type { PageProps, AuditLogEntry } from '@/types'
import { useErp } from '@/context/ErpContext'

export default function AuditLogsPage({ activePage, onNavigate }: PageProps) {
  const { stockLedger } = useErp()

  const handleNewRecordClick = () => {
    onNavigate('dashboard') 
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <ErpSidebar
        navItems={erpNavItems}
        footerItems={erpFooterNavItems}
        activePage={activePage}
        onNavigate={onNavigate}
        onNewRecordClick={handleNewRecordClick}
        userName="Amit Sharma"
        userRole="System Administrator"
        userInitials="AS"
      />

      <div className="ml-60 flex min-h-screen flex-col">
        {/* Simple top header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <h1 className="text-lg font-bold text-slate-900">Audit Logs</h1>
          <p className="text-sm text-slate-500 italic">(Should include all fields whose logs needs to be tracked)</p>
        </header>

        <main className="flex-1 p-6 bg-white m-6 border border-slate-300 rounded shadow-sm">
          <AuditLogsHeader stats={{
            total: stockLedger.length,
            created: 0,
            updated: 0,
            deleted: 0
          }} />
          <AuditLogsFilterBar options={filterOptions} />
          <AuditLogsTable logs={stockLedger.map((entry): AuditLogEntry => ({
            id: entry.id,
            dateTime: entry.date,
            user: 'System Admin',
            action: 'Updated',
            module: 'Inventory',
            recordType: 'StockLedger',
            recordId: entry.reference,
            fieldChanged: 'Quantity',
            oldValue: 'N/A',
            newValue: String(entry.quantity)
          }))} />
        </main>
      </div>
    </div>
  )
}
