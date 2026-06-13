import { Package, Calendar } from 'lucide-react'

interface MOProductInfoProps {
  finishedProduct: string
  billOfMaterials: string
  quantityToProduce: number
  uom: string
  responsible: string
  scheduledDate: string
  deadline: string
  sourceDocument: string
  productOptions: string[]
  bomOptions: string[]
  responsibleOptions: string[]
  onProductChange: (value: string) => void
  onBomChange: (value: string) => void
  onQuantityChange: (value: number) => void
  onResponsibleChange: (value: string) => void
  onScheduledDateChange: (value: string) => void
  onDeadlineChange: (value: string) => void
  onSourceDocumentChange: (value: string) => void
}

export default function MOProductInfo({
  finishedProduct,
  billOfMaterials,
  quantityToProduce,
  uom,
  responsible,
  scheduledDate,
  deadline,
  sourceDocument,
  productOptions,
  bomOptions,
  responsibleOptions,
  onProductChange,
  onBomChange,
  onQuantityChange,
  onResponsibleChange,
  onScheduledDateChange,
  onDeadlineChange,
  onSourceDocumentChange,
}: MOProductInfoProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      {/* Section header */}
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
          <Package className="h-4 w-4 text-indigo-600" />
        </div>
        <h2 className="text-sm font-bold text-slate-900">Product Information</h2>
      </div>

      {/* Form grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {/* Finished Product */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Finished Product
          </label>
          <select
            value={finishedProduct}
            onChange={(e) => onProductChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            {productOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Bill of Materials */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Bill of Materials
          </label>
          <select
            value={billOfMaterials}
            onChange={(e) => onBomChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            {bomOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[10px] text-slate-400">Auto-populated based on selected product</p>
        </div>

        {/* Quantity to Produce */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Quantity to Produce
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={quantityToProduce}
              onChange={(e) => onQuantityChange(Number(e.target.value))}
              min={0}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1.5 text-xs font-medium text-slate-600">
              {uom}
            </span>
          </div>
        </div>

        {/* Responsible */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Responsible
          </label>
          <select
            value={responsible}
            onChange={(e) => onResponsibleChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            {responsibleOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Scheduled Date */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Scheduled Date
          </label>
          <div className="relative">
            <input
              type="text"
              value={scheduledDate}
              onChange={(e) => onScheduledDateChange(e.target.value)}
              placeholder="DD-MM-YYYY"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pr-9 text-sm text-slate-800 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Deadline */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Deadline
          </label>
          <div className="relative">
            <input
              type="text"
              value={deadline}
              onChange={(e) => onDeadlineChange(e.target.value)}
              placeholder="DD-MM-YYYY"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pr-9 text-sm text-slate-800 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Source Document — full width */}
        <div className="col-span-2">
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Source Document
          </label>
          <input
            type="text"
            value={sourceDocument}
            onChange={(e) => onSourceDocumentChange(e.target.value)}
            placeholder="e.g. SO-2024-0891"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
          <p className="mt-1 text-[10px] text-slate-400">Reference to originating Sales Order</p>
        </div>
      </div>
    </div>
  )
}
