import { Settings, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import type { AssignedUser } from '@/types'

interface InternalControlProps {
  assignedUser: AssignedUser
  salesRepOptions: string[]
  onAssignedUserChange: (name: string) => void
}

export default function InternalControl({
  assignedUser,
  salesRepOptions,
  onAssignedUserChange,
}: InternalControlProps) {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Settings className="h-4 w-4 text-slate-500" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Internal Control
        </h3>
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium text-slate-600">
          Assigned Representative
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 transition-colors hover:border-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <span>{assignedUser.name}</span>
            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
            />
          </button>
          {showDropdown && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
              {salesRepOptions.map((person) => (
                <button
                  key={person}
                  type="button"
                  onClick={() => {
                    onAssignedUserChange(person)
                    setShowDropdown(false)
                  }}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-indigo-50 ${
                    person === assignedUser.name
                      ? 'bg-indigo-50 font-medium text-indigo-700'
                      : 'text-slate-700'
                  }`}
                >
                  {person}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User card */}
      <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
          {assignedUser.initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">
            {assignedUser.name}
          </p>
          <p className="text-xs text-slate-500">{assignedUser.role}</p>
        </div>
      </div>
    </div>
  )
}
