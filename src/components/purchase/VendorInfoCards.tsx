import { Building2, MapPin } from 'lucide-react'

interface VendorInfoCardsProps {
  vendorName: string
  vendorCode: string
  vendorAddress: string
  responsiblePerson: string
  responsibleRole: string
}

export default function VendorInfoCards({
  vendorName,
  vendorCode,
  vendorAddress,
  responsiblePerson,
  responsibleRole,
}: VendorInfoCardsProps) {
  const initials = responsiblePerson
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Vendor Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Vendor
        </p>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
            <Building2 className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{vendorName}</p>
            <p className="text-xs text-slate-500">{vendorCode}</p>
          </div>
        </div>
      </div>

      {/* Vendor Address Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Vendor Address
        </p>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
            <MapPin className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-sm leading-relaxed text-slate-700">{vendorAddress}</p>
        </div>
      </div>

      {/* Responsible Person Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Responsible Person
        </p>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
            {initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{responsiblePerson}</p>
            <p className="text-xs text-slate-500">{responsibleRole}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
