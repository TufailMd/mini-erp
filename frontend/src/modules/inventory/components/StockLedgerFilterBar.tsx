
import { Search, Calendar } from 'lucide-react';
import { ledgerFilterOptions } from '@/data/stockLedgerData';

interface StockLedgerFilterBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
}

export function StockLedgerFilterBar({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  dateRange,
  setDateRange
}: StockLedgerFilterBarProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 space-y-4">
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-4">
        {ledgerFilterOptions.movementTypes.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {tab === 'All' ? 'All' : tab === 'Transfer' ? 'Transfers' : `Stock ${tab}`}
          </button>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by reference, product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="relative min-w-[200px]">
          <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
          >
            {ledgerFilterOptions.dateRanges.map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
