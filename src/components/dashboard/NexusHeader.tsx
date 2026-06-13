import { Search, Moon, Bell, Plus } from 'lucide-react'

interface NexusHeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  onButtonClick: () => void
}

export default function NexusHeader({
  searchQuery,
  onSearchChange,
  onButtonClick,
}: NexusHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-8">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search orders, products, or logs..."
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onButtonClick}
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
        >
          <Moon className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={onButtonClick}
          className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <button
          type="button"
          onClick={onButtonClick}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Order
        </button>
      </div>
    </header>
  )
}
