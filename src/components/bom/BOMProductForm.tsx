interface BOMProductFormProps {
  finishedProduct: string
  quantity: number
  uom: string
  notes: string
  finishedProductOptions: string[]
  uomOptions: string[]
  onChange: (field: string, value: string | number) => void
}

export default function BOMProductForm({
  finishedProduct,
  quantity,
  uom,
  notes,
  finishedProductOptions,
  uomOptions,
  onChange,
}: BOMProductFormProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-sm font-bold tracking-wider text-slate-800 uppercase">Product Configuration</h2>
      
      <div className="space-y-6">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Finished Product <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded">Mandatory Field</span>
          </div>
          <select
            value={finishedProduct}
            onChange={(e) => onChange('finishedProduct', e.target.value)}
            className="w-full rounded-lg border border-slate-200 p-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            {finishedProductOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-slate-500">Select the finished product this BOM defines. Auto-fetched from product catalog.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => onChange('quantity', parseInt(e.target.value) || 1)}
              min="1"
              className="w-full rounded-lg border border-slate-200 p-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Unit of Measure
            </label>
            <select
              value={uom}
              onChange={(e) => onChange('uom', e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              {uomOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Reference / Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => onChange('notes', e.target.value)}
            placeholder="Add any specific instructions or references..."
            rows={2}
            className="w-full rounded-lg border border-slate-200 p-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <p className="mt-1.5 text-xs text-slate-500">This field allows you to add reference notes. Light yellow on many themes.</p>
        </div>
      </div>
    </div>
  )
}
