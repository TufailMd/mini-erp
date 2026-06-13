import { ImageIcon, Trash2 } from 'lucide-react'

interface ProductAssetProps {
  imagePath: string
  onReplace: () => void
  onDelete: () => void
}

export default function ProductAsset({
  imagePath,
  onReplace,
  onDelete,
}: ProductAssetProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
        Product Asset
      </h3>

      {/* Image */}
      <div className="mb-4 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
        {imagePath ? (
          <img
            src={imagePath}
            alt="Product"
            className="h-48 w-full object-cover"
          />
        ) : (
          <div className="flex h-48 items-center justify-center">
            <ImageIcon className="h-12 w-12 text-slate-300" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onReplace}
          className="flex-1 rounded-lg border border-slate-300 bg-white py-2 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          Replace
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg border border-red-200 bg-white p-2 text-red-500 transition-colors hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
