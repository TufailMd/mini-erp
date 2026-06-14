import { X } from 'lucide-react'
import { erpNavItems, erpFooterNavItems } from '@/constants/navigation'
import type { PageId } from '@/types'

interface MasterSidebarProps {
  isOpen: boolean
  onClose: () => void
  activePage: PageId
  onNavigate: (page: PageId) => void
}

export default function MasterSidebar({ isOpen, onClose, activePage, onNavigate }: MasterSidebarProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <h2 className="text-lg font-bold text-slate-900">Master Menu</h2>
          <button onClick={onClose} className="p-1 text-slate-500 hover:bg-slate-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          <ul className="space-y-1 text-sm font-medium">
            {erpNavItems.map((item) => {
              const Icon = item.icon
              const isActive = activePage === item.id
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onNavigate(item.id)
                      onClose()
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    {item.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </>
  )
}
