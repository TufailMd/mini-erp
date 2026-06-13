
import { Download, Printer } from 'lucide-react';

export function StockLedgerHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Stock Ledger</h1>
        <p className="text-sm text-gray-500 mt-1">Chronological history of all stock movements</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm">
          <Printer className="w-4 h-4" />
          Print Report
        </button>
      </div>
    </div>
  );
}
