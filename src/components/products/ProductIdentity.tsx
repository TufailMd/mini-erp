interface ProductIdentityProps {
  productName: string
  salesPrice: number
  costPrice: number
  isDraft: boolean
  onProductNameChange: (value: string) => void
  onSalesPriceChange: (value: string) => void
  onCostPriceChange: (value: string) => void
}

export default function ProductIdentity({
  productName,
  salesPrice,
  costPrice,
  isDraft,
  onProductNameChange,
  onSalesPriceChange,
  onCostPriceChange,
}: ProductIdentityProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Product Identity</h3>
        {isDraft && (
          <span className="rounded-md bg-indigo-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Draft Mode
          </span>
        )}
      </div>

      {/* Product Name */}
      <div className="mb-1">
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Product Name
        </label>
        <input
          type="text"
          value={productName}
          onChange={(e) => onProductNameChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 transition-colors focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
        <p className="mt-1.5 text-xs italic text-slate-400">
          System creates a unique reference ID upon record finalization.
        </p>
      </div>

      {/* Prices */}
      <div className="mt-5 grid grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Sales Price (₹)
          </label>
          <input
            type="text"
            value={`₹${salesPrice.toFixed(2)}`}
            onChange={(e) =>
              onSalesPriceChange(e.target.value.replace(/[^0-9.]/g, ''))
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 transition-colors focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          <p className="mt-1.5 text-xs text-slate-400">
            Populates automatically on new Sales Orders.
          </p>
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Cost Price (₹)
          </label>
          <input
            type="text"
            value={`₹${costPrice.toFixed(2)}`}
            onChange={(e) =>
              onCostPriceChange(e.target.value.replace(/[^0-9.]/g, ''))
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 transition-colors focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          <p className="mt-1.5 text-xs text-slate-400">
            Populates automatically on Purchase Orders.
          </p>
        </div>
      </div>
    </div>
  )
}
