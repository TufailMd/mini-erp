import { useState } from 'react'
import { Pencil } from 'lucide-react'
import AppNavbar from '../components/layout/AppNavbar'
import MasterSidebar from '../components/layout/MasterSidebar'
import UserProfileDrawer from '../components/layout/UserProfileDrawer'
import { systemUsers } from '../data/userManagementData'
import { userProfileData } from '../data/newDashboardData'
import type { PageProps, UserProfile, FieldPermission } from '../types'
import { toast } from 'react-hot-toast'

type ModuleTab = 'Sales' | 'Purchase' | 'Manufacturing' | 'Product'

export default function UserManagementDetailPage({ activePage, onNavigate }: PageProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [profile, setProfile] = useState<UserProfile>(userProfileData)
  
  const [activeTab, setActiveTab] = useState<ModuleTab>('Sales')
  
  // For demo purposes, we're just loading Mahesh Gupta
  const user = systemUsers[0]

  const renderPermissionValue = (val: string) => {
    if (val === 'yes') return <span className="text-slate-800 font-bold">✓</span>
    if (val === 'no') return <span className="text-slate-400 font-bold">X</span>
    return <span className="text-slate-600 text-xs font-medium">{val}</span>
  }

  const renderPermissionsTable = (permissions: FieldPermission[]) => (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 border-y border-slate-200">
          <tr>
            <th className="px-4 py-3 font-semibold text-slate-900 border-r border-slate-200 w-1/3">Field</th>
            <th className="px-4 py-3 font-semibold text-slate-900 text-center border-r border-slate-200">Create</th>
            <th className="px-4 py-3 font-semibold text-slate-900 text-center border-r border-slate-200">View</th>
            <th className="px-4 py-3 font-semibold text-slate-900 text-center border-r border-slate-200">Edit</th>
            <th className="px-4 py-3 font-semibold text-slate-900 text-center">Delete</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {permissions.map((perm, idx) => (
            <tr key={idx} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 border-r border-slate-200 text-slate-800">{perm.field}</td>
              <td className="px-4 py-3 border-r border-slate-200 text-center">{renderPermissionValue(perm.create)}</td>
              <td className="px-4 py-3 border-r border-slate-200 text-center">{renderPermissionValue(perm.view)}</td>
              <td className="px-4 py-3 border-r border-slate-200 text-center">{renderPermissionValue(perm.edit)}</td>
              <td className="px-4 py-3 text-center">{renderPermissionValue(perm.delete)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
            <h1 className="text-2xl font-bold text-slate-900">User Management Form View</h1>
            <button 
              onClick={() => onNavigate('user-management')}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              &larr; Back to Dashboard
            </button>
          </div>

          <div className="w-full rounded-2xl border border-slate-300 bg-white shadow-premium overflow-hidden flex flex-col mb-6">
            
            {/* Header / Profile Section */}
            <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row gap-8 relative">
              <div className="flex-1 space-y-4">
                
                {/* Read-Only Outline matching wireframe red dashed line conceptually */}
                <div className="relative p-4 border border-dashed border-red-300 rounded-xl bg-red-50/30">
                  <span className="absolute -top-3 left-4 bg-white px-2 text-xs font-semibold text-red-500">
                    read-only
                  </span>
                  
                  <div className="space-y-3">
                    <div className="flex text-sm">
                      <span className="w-32 font-medium text-slate-600">Name :</span>
                      <span className="text-slate-900">{user.name}</span>
                    </div>
                    <div className="flex text-sm">
                      <span className="w-32 font-medium text-slate-600">Address:</span>
                      <span className="text-slate-900">{user.address}</span>
                    </div>
                    <div className="flex text-sm">
                      <span className="w-32 font-medium text-slate-600">Mobile Number :</span>
                      <span className="text-slate-900">{user.mobile}</span>
                    </div>
                    <div className="flex text-sm">
                      <span className="w-32 font-medium text-slate-600">Email ID:</span>
                      <span className="text-slate-900">{user.email}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 pl-4 flex items-center gap-4">
                  <div className="flex text-sm items-center w-full max-w-md">
                    <span className="w-32 font-medium text-slate-600 shrink-0">Position:</span>
                    <input 
                      type="text" 
                      defaultValue={user.position}
                      className="w-full border-b border-slate-300 bg-transparent px-2 py-1 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <span className="text-xs text-red-500 italic hidden sm:block whitespace-nowrap">
                    Only Position Field is editable by System Administrator
                  </span>
                </div>
              </div>

              {/* Avatar block matching wireframe */}
              <div className="shrink-0 flex items-start justify-end md:w-48">
                <div className="relative h-32 w-24 sm:w-32 rounded-xl border-2 border-slate-200 bg-slate-50 flex items-end justify-end p-2 shadow-sm">
                   <button 
                    onClick={() => toast('Edit photo clicked')}
                    className="p-1.5 bg-white rounded-md border border-slate-200 text-slate-500 hover:text-slate-700 shadow-sm"
                  >
                    <Pencil className="w-4 h-4" />
                   </button>
                </div>
              </div>
            </div>

            {/* Permissions Tabs */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 flex gap-2 pt-4">
              {(['Sales', 'Purchase', 'Manufacturing', 'Product'] as ModuleTab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-x border-t transition-colors ${
                    activeTab === tab 
                      ? 'bg-white border-slate-300 text-indigo-700 shadow-sm z-10 -mb-px' 
                      : 'bg-slate-100 border-transparent text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white">
              {activeTab === 'Sales' && renderPermissionsTable(user.permissions.sales)}
              {activeTab === 'Purchase' && renderPermissionsTable(user.permissions.purchase)}
              {activeTab === 'Manufacturing' && renderPermissionsTable(user.permissions.manufacturing)}
              {activeTab === 'Product' && renderPermissionsTable(user.permissions.product)}
            </div>
            
          </div>

        </div>
      </main>
    </div>
  )
}
