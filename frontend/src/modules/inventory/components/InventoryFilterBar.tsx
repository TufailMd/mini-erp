import React from 'react';
import { Filter, Download } from 'lucide-react';

const InventoryFilterBar: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
      <div className="flex space-x-2">
        <button className="px-4 py-2 rounded-md bg-indigo-50 text-indigo-700 text-sm font-medium">
          Overview
        </button>
        <button className="px-4 py-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 text-sm font-medium">
          Locations
        </button>
        <button className="px-4 py-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 text-sm font-medium">
          Stock Takes
        </button>
      </div>
      <div className="flex space-x-3">
        <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          <Filter className="-ml-1 mr-2 h-4 w-4 text-gray-400" />
          Filter
        </button>
        <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          <Download className="-ml-1 mr-2 h-4 w-4 text-gray-400" />
          Export
        </button>
      </div>
    </div>
  );
};

export default InventoryFilterBar;
