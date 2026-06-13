import { useState } from 'react'
import { Search, Filter, Download } from 'lucide-react'
import AppNavbar from '../components/layout/AppNavbar'
import MasterSidebar from '../components/layout/MasterSidebar'
import UserProfileDrawer from '../components/layout/UserProfileDrawer'
import { systemUsers } from '../data/userManagementData'
import { userProfileData } from '../data/newDashboardData'
import type { PageProps, UserProfile } from '../types'

export default function UserManagementListPage({ activePage, onNavigate }: PageProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [profile, setProfile] = useState<UserProfile>(userProfileData)

  const filteredUsers = systemUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <AppNavbar 
        onToggleMenu={() => setIsSidebarOpen(true)}
        onToggleProfile={() => setIsProfileOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateNew={() => {}}
      />

      <MasterSidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activePage={activePage}
        onNavigate={onNavigate}
      />

      <UserProfileDrawer 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSaveProfile={setProfile}
      />

      <main className="flex-1 p-6 flex justify-center">
        <div className="w-full max-w-4xl pt-4">
          
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-slate-900">System Administrator Dashboard</h1>
          </div>

          <div className="w-full rounded-xl border border-slate-300 bg-white shadow-premium overflow-hidden flex flex-col mb-6">
            <div className="border-b border-slate-200 bg-slate-50 py-3 px-4 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-slate-800">Users</h3>
              <div className="flex items-center gap-2 text-slate-500">
                <button className="p-1 hover:bg-slate-200 rounded">
                  <Search className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-slate-200 rounded">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-slate-200 rounded text-red-500">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-col">
              {filteredUsers.map((user) => (
                <div 
                  key={user.id}
                  onClick={() => onNavigate('user-management-detail')}
                  className={`px-4 py-3 cursor-pointer transition-colors hover:bg-indigo-50 border-b border-slate-100 last:border-b-0`}
                >
                  <span className="text-sm font-medium text-slate-800">{user.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
