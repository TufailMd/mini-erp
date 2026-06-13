import { useState } from 'react'
import { X, Upload, Check } from 'lucide-react'
import type { UserProfile } from '@/types'

interface UserProfileDrawerProps {
  isOpen: boolean
  onClose: () => void
  profile: UserProfile
  onSaveProfile: (updated: UserProfile) => void
}

export default function UserProfileDrawer({ isOpen, onClose, profile, onSaveProfile }: UserProfileDrawerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<UserProfile>(profile)

  const handleSave = () => {
    onSaveProfile(formData)
    setIsEditing(false)
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer Panel */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-80 lg:w-96 transform border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
          <h2 className="text-lg font-bold text-slate-900">User Login Detail Management</h2>
          <button onClick={onClose} className="p-1 text-slate-500 hover:bg-slate-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto h-[calc(100vh-4rem)]">
          {/* Avatar Section */}
          <div className="mb-8 flex flex-col items-center">
            <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-lg border-2 border-slate-200 bg-slate-100">
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-slate-400">
                  {formData.name.charAt(0)}
                </div>
              )}
              {isEditing && (
                <button className="absolute bottom-1 right-1 rounded-md bg-white/90 p-1.5 shadow-sm hover:bg-white text-slate-700">
                  <Upload className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Form Section */}
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Name :</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className={`w-full rounded-md border px-3 py-2 text-sm ${isEditing ? 'border-indigo-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white' : 'border-transparent bg-slate-50 text-slate-900'}`}
              />
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Address:</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!isEditing}
                rows={2}
                className={`w-full rounded-md border px-3 py-2 text-sm ${isEditing ? 'border-indigo-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white' : 'border-transparent bg-slate-50 text-slate-900'}`}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Mobile Number :</label>
              <input
                type="text"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                disabled={!isEditing}
                className={`w-full rounded-md border px-3 py-2 text-sm ${isEditing ? 'border-indigo-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white' : 'border-transparent bg-slate-50 text-slate-900'}`}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email ID : <span className="text-xs text-slate-400 font-normal">(Read-only)</span></label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full rounded-md border border-transparent bg-slate-100 px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Position: <span className="text-xs text-slate-400 font-normal">(Managed by Admin)</span></label>
              <input
                type="text"
                value={formData.position}
                disabled
                className="w-full rounded-md border border-transparent bg-slate-100 px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>

          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setFormData(profile)
                    setIsEditing(false)
                  }}
                  className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
                >
                  <Check className="h-4 w-4" />
                  Save Photo & Details
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
