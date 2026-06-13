import React from 'react';
import { PageProps } from '@/types';
import ErpSidebar from '@/modules/sales/components/ErpSidebar';
import { erpNavItems, erpFooterNavItems } from '@/data/salesData';
import InventoryHeader from '@/modules/inventory/components/InventoryHeader';
import InventoryStatCards from '@/modules/inventory/components/InventoryStatCards';
import InventoryFilterBar from '@/modules/inventory/components/InventoryFilterBar';
import InventoryTable from '@/modules/inventory/components/InventoryTable';
import InventoryPagination from '@/modules/inventory/components/InventoryPagination';

const InventoryPage: React.FC<PageProps> = ({ activePage, onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* Sidebar */}
      <ErpSidebar 
        activePage={activePage} 
        onNavigate={onNavigate} 
        navItems={erpNavItems}
        footerItems={erpFooterNavItems}
        onNewRecordClick={() => {}}
        userName="Admin User"
        userRole="System Administrator"
        userInitials="AD"
      />

      {/* Main Content */}
      <div className="ml-60 flex min-h-screen flex-col">
        <main className="flex-1 p-6 overflow-y-auto focus:outline-none">
          <div className="max-w-7xl mx-auto">
            <InventoryHeader />
            <InventoryStatCards />
            <InventoryFilterBar />
            <InventoryTable />
            <InventoryPagination />
          </div>
        </main>
      </div>
    </div>
  );
};

export default InventoryPage;
