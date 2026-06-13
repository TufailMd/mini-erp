import { useState } from 'react';
import ErpSidebar from '@/modules/sales/components/ErpSidebar';
import { erpNavItems, erpFooterNavItems } from '@/data/salesData';
import { StockLedgerHeader } from '@/modules/inventory/components/StockLedgerHeader';
import { StockLedgerFilterBar } from '@/modules/inventory/components/StockLedgerFilterBar';
import { StockLedgerTable } from '@/modules/inventory/components/StockLedgerTable';
import type { PageProps } from '@/types';

export default function StockLedgerPage({ activePage, onNavigate }: PageProps) {

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Today');

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
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
            
            {/* Pagination Placeholder */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-xl shadow-sm mt-4">
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                    <span className="font-medium">20</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                      <span className="sr-only">Previous</span>
                      &larr;
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                      1
                    </button>
                    <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                      <span className="sr-only">Next</span>
                      &rarr;
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
