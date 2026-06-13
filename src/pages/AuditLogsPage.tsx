import { useState } from 'react'
import ErpSidebar from '../components/sales/ErpSidebar'
import AuditLogsHeader from '../components/audit/AuditLogsHeader'
import AuditLogsFilterBar from '../components/audit/AuditLogsFilterBar'
import AuditLogsTable from '../components/audit/AuditLogsTable'
import { erpNavItems, erpFooterNavItems } from '../data/salesData'
import { auditLogs, auditStats, filterOptions } from '../data/auditLogsData'
import type { PageProps } from '../types'

export default function AuditLogsPage({ activePage, onNavigate }: PageProps) {
  // In a real application, we'd handle filter state and pagination here.
  // For this wireframe representation, we use the static mock data.

  const handleNewRecordClick = () => {
    // This could navigate to a default record creation page or just be a placeholder
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
          <AuditLogsHeader stats={auditStats} />
          <AuditLogsFilterBar options={filterOptions} />
          <AuditLogsTable logs={auditLogs} />
        </main>
      </div>
    </div>
  )
}
