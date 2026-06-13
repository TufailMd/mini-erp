import { X, Save, ClipboardList, MoreVertical } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ProductDetailActionsProps {
  onCancel: () => void
  onSave: () => void
  onViewAudit: () => void
}

export default function ProductDetailActions({
  onCancel,
  onSave,
  onViewAudit,
}: ProductDetailActionsProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          <Save className="h-4 w-4" />
          Save Record
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onViewAudit}
          className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <ClipboardList className="h-4 w-4" />
          View Audit Logs
        </button>
        <button
          type="button"
          onClick={() => toast('More options clicked')}
          className="rounded-lg border border-slate-300 bg-white p-2 text-slate-500 transition-colors hover:bg-slate-50"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
