import React from 'react';
import { inventoryStatCards } from '@/data/inventoryData';

const InventoryStatCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {inventoryStatCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{card.title}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{card.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
              <div className="text-sm">
                <span className={`font-medium ${
                  card.changeType === 'positive' ? 'text-green-600' : 
                  card.changeType === 'negative' ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  {card.change}
                </span>
                <span className="text-gray-500 ml-2">from last month</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InventoryStatCards;
