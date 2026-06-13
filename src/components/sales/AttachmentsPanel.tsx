import { ImageIcon } from 'lucide-react'

interface AttachmentsPanelProps {
  count: number
  onBrowse: () => void
}

export default function AttachmentsPanel({
  count,
  onBrowse,
}: AttachmentsPanelProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Attachments ({count})
        </h3>
        <button
          type="button"
          onClick={onBrowse}
          className="text-xs font-bold uppercase tracking-wider text-indigo-600 transition-colors hover:text-indigo-700"
        >
          Browse
        </button>
      </div>

      {/* Placeholder */}
      <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50">
        <ImageIcon className="h-8 w-8 text-slate-300" />
      </div>
    </div>
  )
}
