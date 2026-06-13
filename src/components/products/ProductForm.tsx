import type { ProcurementConfig } from '../../types'

interface ProductFormProps {
  productName: string
  salesPrice: number
  costPrice: number
  onHandQty: string
  freeToUseQty: string
  procurement: ProcurementConfig
  onProductNameChange: (value: string) => void
  onSalesPriceChange: (value: string) => void
  onCostPriceChange: (value: string) => void
  onToggleProcurement: () => void
  onProcurementTypeChange: (type: 'Purchase' | 'Manufacturing') => void
  onVendorChange: (vendor: string) => void
  onBomChange: (bom: string) => void
}

export default function ProductForm({
  productName,
  salesPrice,
  costPrice,
  onHandQty,
  freeToUseQty,
  procurement,
  onProductNameChange,
  onSalesPriceChange,
  onCostPriceChange,
  onToggleProcurement,
  onProcurementTypeChange,
  onVendorChange,
  onBomChange,
}: ProductFormProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="grid grid-cols-2 gap-12">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="flex items-center">
            <label className="w-1/3 text-sm font-medium text-slate-700">Product</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => onProductNameChange(e.target.value)}
              className="w-2/3 border-b border-slate-300 px-2 py-1 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          
          <div className="flex items-center">
            <label className="w-1/3 text-sm font-medium text-slate-700">
              Sales Price <span className="ml-1 text-[10px] text-slate-400">₹</span>
            </label>
            <input
              type="text"
              value={salesPrice.toString()}
              onChange={(e) => onSalesPriceChange(e.target.value.replace(/[^0-9.]/g, ''))}
              className="w-2/3 border-b border-slate-300 px-2 py-1 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center">
            <label className="w-1/3 text-sm font-medium text-slate-700">
              Cost Price <span className="ml-1 text-[10px] text-slate-400">₹</span>
            </label>
            <input
              type="text"
              value={costPrice.toString()}
              onChange={(e) => onCostPriceChange(e.target.value.replace(/[^0-9.]/g, ''))}
              className="w-2/3 border-b border-slate-300 px-2 py-1 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center">
            <label className="w-1/3 text-sm font-medium text-slate-700">On hand Qty</label>
            <div className="w-2/3">
              <input
                type="text"
                readOnly
                value={onHandQty}
                className="w-full border-b border-slate-300 bg-transparent px-2 py-1 text-sm text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center">
            <label className="w-1/3 text-sm font-medium text-slate-700">Free to Use Qty</label>
            <div className="w-2/3">
              <input
                type="text"
                readOnly
                value={freeToUseQty}
                className="w-full border-b border-slate-300 bg-transparent px-2 py-1 text-sm text-slate-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="flex items-center">
            <label className="w-1/2 text-sm font-medium text-slate-700">Procure on Demand</label>
            <div className="w-1/2">
              <input
                type="checkbox"
                checked={procurement.procureOnDemand}
                onChange={onToggleProcurement}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
          </div>

          {procurement.procureOnDemand && (
            <>
              <div className="flex items-center">
                <label className="w-1/2 text-sm font-medium text-slate-700">Procurement Type <span className="text-red-500">*</span></label>
                <select
                  value={procurement.procurementType || ''}
                  onChange={(e) => onProcurementTypeChange(e.target.value as 'Purchase' | 'Manufacturing')}
                  className="w-1/2 border-b border-slate-300 bg-transparent px-2 py-1 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="" disabled>Select Type</option>
                  <option value="Purchase">Purchase</option>
                  <option value="Manufacturing">Manufacturing</option>
                </select>
              </div>

              {procurement.procurementType === 'Purchase' && (
                <div className="flex items-center">
                  <label className="w-1/2 text-sm font-medium text-slate-700">Vendor <span className="text-red-500">*</span></label>
                  <select
                    value={procurement.vendor || ''}
                    onChange={(e) => onVendorChange(e.target.value)}
                    className="w-1/2 border-b border-slate-300 bg-transparent px-2 py-1 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="" disabled>Select Vendor</option>
                    {procurement.vendorOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              )}

              {procurement.procurementType === 'Manufacturing' && (
                <div className="flex items-center">
                  <label className="w-1/2 text-sm font-medium text-slate-700">BOM <span className="text-red-500">*</span></label>
                  <select
                    value={procurement.bom || ''}
                    onChange={(e) => onBomChange(e.target.value)}
                    className="w-1/2 border-b border-slate-300 bg-transparent px-2 py-1 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="" disabled>Select BOM</option>
                    {procurement.bomOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
