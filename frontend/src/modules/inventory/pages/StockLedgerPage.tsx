import { useState, useEffect } from 'react';
import ErpSidebar from '@/components/layout/ErpSidebar';
import { erpNavItems, erpFooterNavItems } from '@/constants/navigation';
import { StockLedgerHeader } from '@/modules/inventory/components/StockLedgerHeader';
import { StockLedgerFilterBar } from '@/modules/inventory/components/StockLedgerFilterBar';
import { StockLedgerTable } from '@/modules/inventory/components/StockLedgerTable';
import type { PageProps } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useErp } from '@/context/ErpContext';

export default function StockLedgerPage({ activePage, onNavigate }: PageProps) {
  const { user } = useAuth();
  const { refreshData } = useErp();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Today');

  // Refresh backend data each time this page mounts
  useEffect(() => {
    refreshData()
  }, [])

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <ErpSidebar 
        activePage={activePage}
        onNavigate={onNavigate}
        navItems={erpNavItems}
        footerItems={erpFooterNavItems}
        onNewRecordClick={() => {}}
        userName={user?.email ?? 'Admin'}
        userRole={String(user?.role ?? 'ADMIN')}
        userInitials={(user?.email ?? 'A').slice(0, 2).toUpperCase()}
      />
      
      <div className="ml-60 flex min-h-screen flex-col">
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <StockLedgerHeader />
            <StockLedgerFilterBar 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
            <StockLedgerTable 
              filterTab={activeTab}
              searchQuery={searchQuery}
            />
            

          </div>
        </main>
      </div>
    </div>
  );
}
