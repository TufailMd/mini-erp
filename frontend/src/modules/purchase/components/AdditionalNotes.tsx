interface AdditionalNotesProps {
  notes: string
  onNotesChange: (value: string) => void
}

export default function AdditionalNotes({
  notes,
  onNotesChange,
}: AdditionalNotesProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-900">
        Additional Terms &amp; Notes
      </h3>
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Add any special instructions, delivery terms, or notes for this purchase order..."
        rows={4}
        className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  )
}
