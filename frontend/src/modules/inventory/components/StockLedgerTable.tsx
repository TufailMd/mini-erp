import { useState } from 'react';
import { useErp } from '@/context/ErpContext';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import Pagination from '@/components/common/Pagination';

interface StockLedgerTableProps {
  filterTab: string;
  searchQuery: string;
}

export const StockLedgerTable = ({ filterTab, searchQuery }: StockLedgerTableProps) => {
  const { stockLedger, products } = useErp();

  // Basic filtering
  let filtered = stockLedger;
  
  if (filterTab !== 'All') {
    const tabType = filterTab === 'Transfer' ? 'Transfer' : filterTab === 'In' ? 'In' : 'Out';
    filtered = filtered.filter(entry => entry.movementType === tabType as any);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(entry => {
      const product = products.find(p => p.id === entry.productId);
      const productName = product ? product.name.toLowerCase() : `product ${entry.productId}`;
      return entry.reference.toLowerCase().includes(q) || productName.includes(q);
    });
  }

  // Sort descending by date (newest first)
  const displayEntries = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(displayEntries.length / PAGE_SIZE));
  const paginatedEntries = displayEntries.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (displayEntries.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
        No stock ledger entries found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
              <th className="p-4">Date & Time</th>
              <th className="p-4">Reference</th>
              <th className="p-4">Product</th>
              <th className="p-4">Type</th>
              <th className="p-4 text-right">Quantity</th>
              <th className="p-4 text-right">Balance</th>
              <th className="p-4">User</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedEntries.map((entry) => {
              const product = products.find(p => p.id === entry.productId);
              const productName = product ? product.name : `Product ${entry.productId}`;
              const isIn = entry.movementType === 'In';
              const isOut = entry.movementType === 'Out';

              return (
                <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(entry.date).toLocaleString()}
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-900">
                    {entry.reference}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {productName}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      isIn ? 'bg-green-100 text-green-700' : 
                      isOut ? 'bg-red-100 text-red-700' : 
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {entry.movementType}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-right font-medium">
                    <div className={`flex items-center justify-end gap-1 ${
                      isIn ? 'text-green-600' : isOut ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {isIn && <ArrowDownRight className="w-4 h-4" />}
                      {isOut && <ArrowUpRight className="w-4 h-4" />}
                      {isIn ? '+' : isOut ? '-' : ''}{entry.quantity}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-right text-gray-900 font-medium">
                    {entry.balance}
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    System
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={displayEntries.length}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
