import React, { useEffect } from 'react';
import { PageProps } from '@/types';
import ErpSidebar from '@/components/layout/ErpSidebar';
import { erpNavItems, erpFooterNavItems } from '@/constants/navigation';
import InventoryHeader from '@/modules/inventory/components/InventoryHeader';
import InventoryStatCards from '@/modules/inventory/components/InventoryStatCards';
import InventoryFilterBar from '@/modules/inventory/components/InventoryFilterBar';
import InventoryTable from '@/modules/inventory/components/InventoryTable';
import { useAuth } from '@/context/AuthContext';
import { useErp } from '@/context/ErpContext';

const InventoryPage: React.FC<PageProps> = ({ activePage, onNavigate }) => {
  const { user } = useAuth();
  const { refreshData } = useErp();

  // Refresh backend data each time this page mounts
  useEffect(() => {
    refreshData()
  }, [])
  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="ml-60 flex min-h-screen flex-col">
        <main className="flex-1 p-6 overflow-y-auto focus:outline-none">
          <div className="max-w-7xl mx-auto">
            <InventoryHeader />
            <InventoryStatCards />
            <InventoryFilterBar />
            <InventoryTable />
          </div>
        </main>
      </div>
    </div>
  );
};

export default InventoryPage;
