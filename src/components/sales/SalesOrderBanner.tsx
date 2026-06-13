import { FileText } from 'lucide-react'

export default function SalesOrderBanner() {
  return (
    <div className="mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 shadow-lg">
      <div className="flex items-center gap-5 px-6 py-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
          <FileText className="h-7 w-7 text-white/80" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">
            Sales Order Creation
          </h2>
          <p className="text-sm text-slate-300">
            Initiating a new transaction for regional fulfillment.
          </p>
        </div>
      </div>
    </div>
  )
}
