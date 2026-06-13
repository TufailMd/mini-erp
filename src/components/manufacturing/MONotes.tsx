import { StickyNote } from 'lucide-react'

interface MONotesProps {
  notes: string
  onNotesChange: (value: string) => void
}

export default function MONotes({ notes, onNotesChange }: MONotesProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
          <StickyNote className="h-4 w-4 text-slate-500" />
        </div>
        <h2 className="text-sm font-bold text-slate-900">Production Notes</h2>
      </div>
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        rows={4}
        placeholder="Add manufacturing notes, special instructions, quality requirements..."
        className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  )
}
