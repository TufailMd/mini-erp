import { ArrowLeft, Bell, Clock, User } from 'lucide-react'
import { useState } from 'react'
import type { HeaderTab } from '../../types'

interface ProductDetailHeaderProps {
  productName: string
  reference: string
  onBack: () => void
  onButtonClick: () => void
}

const tabs: { id: HeaderTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'reports', label: 'Reports' },
  { id: 'analytics', label: 'Analytics' },
]

export default function ProductDetailHeader({
  productName,
  reference,
  onBack,
  onButtonClick,
}: ProductDetailHeaderProps) {
  const [activeTab, setActiveTab] = useState<HeaderTab>('overview')

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 text-sm">
          <button
            type="button"
            onClick={onBack}
            className="text-slate-500 transition-colors hover:text-indigo-600"
          >
            Products
          </button>
          <span className="text-slate-400">/</span>
          <span className="font-bold text-slate-900">
            {productName} ({reference})
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <nav className="flex items-center gap-0 mr-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-indigo-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
              )}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={onButtonClick}
          className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <button
          type="button"
          onClick={onButtonClick}
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100"
        >
          <Clock className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onButtonClick}
          className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-slate-300 to-slate-400 hover:opacity-80"
        >
          <User className="h-5 w-5 text-white" />
        </button>
      </div>
    </header>
  )
}
