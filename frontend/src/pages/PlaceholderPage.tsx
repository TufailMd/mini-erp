import { Construction } from 'lucide-react'
import ErpSidebar from '@/modules/sales/components/ErpSidebar'
import { erpNavItems, erpFooterNavItems } from '@/data/salesData'
import type { PageProps } from '@/types'
import { toast } from 'react-hot-toast'

export default function PlaceholderPage({ activePage, onNavigate }: PageProps) {
  const handleButtonClick = () => {
    toast('Action triggered in placeholder')
  }

  const pageLabel =
    [...erpNavItems, ...erpFooterNavItems].find((item) => item.id === activePage)
      ?.label ?? activePage

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <ErpSidebar
        navItems={erpNavItems}
        footerItems={erpFooterNavItems}
        activePage={activePage}
        onNavigate={onNavigate}
        onNewRecordClick={handleButtonClick}
      />

      <div className="ml-60 flex min-h-screen flex-col items-center justify-center p-8">
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
            <Construction className="h-7 w-7 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">{pageLabel}</h2>
          <p className="mt-2 text-sm text-slate-500">
            This page is not implemented yet. Add it to{' '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-indigo-600">
              src/config/pageRegistry.ts
            </code>{' '}
            to wire it up.
          </p>
        </div>
      </div>
    </div>
  )
}
