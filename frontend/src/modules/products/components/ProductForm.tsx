import type { ProcurementConfig } from '@/types'

interface ProductFormProps {
  productName: string
  salesPrice: number
  costPrice: number
  onHandQty: string
  freeToUseQty: string
  productImage?: string | null
  procurement: ProcurementConfig
  onProductNameChange: (value: string) => void
  onSalesPriceChange: (value: string) => void
  onCostPriceChange: (value: string) => void
  onOnHandQtyChange: (value: string) => void
  onFreeToUseQtyChange: (value: string) => void
  onImageChange: (file: File) => void
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
  productImage,
  procurement,
  onProductNameChange,
  onSalesPriceChange,
  onCostPriceChange,
  onOnHandQtyChange,
  onFreeToUseQtyChange,
  onImageChange,
  onToggleProcurement,
  onProcurementTypeChange,
  onVendorChange,
  onBomChange,
}: ProductFormProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      {/* Image Upload Section */}
      <div className="mb-8 flex items-center gap-6 border-b border-slate-100 pb-8">
        <div className="relative flex h-24 w-24 shrink-0 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:border-indigo-500 hover:bg-indigo-50">
          {productImage ? (
            <img src={productImage} alt="Product" className="h-full w-full object-cover" />
          ) : (
            <>
              <svg className="mb-1 h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[10px] font-medium text-slate-500">Upload Photo</span>
            </>
          )}
          <input 
            type="file" 
            className="absolute inset-0 cursor-pointer opacity-0" 
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onImageChange(e.target.files[0])
              }
            }}
          />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Product Image</h3>
          <p className="mt-1 text-xs text-slate-500">Upload a high-quality image of the product.</p>
          <p className="mt-0.5 text-[10px] text-slate-400">Recommended size: 800x800px. Max 2MB.</p>
        </div>
      </div>
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
                value={onHandQty}
                onChange={(e) => onOnHandQtyChange(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full border-b border-slate-300 px-2 py-1 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center">
            <label className="w-1/3 text-sm font-medium text-slate-700">Free to Use Qty</label>
            <div className="w-2/3">
              <input
                type="text"
                value={freeToUseQty}
                onChange={(e) => onFreeToUseQtyChange(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full border-b border-slate-300 px-2 py-1 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
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
                    {procurement.bomOptions?.map((opt) => (
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
