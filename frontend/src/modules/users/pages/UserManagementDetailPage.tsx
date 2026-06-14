import { useState, useEffect } from 'react'
import { Pencil } from 'lucide-react'
import AppNavbar from '@/components/layout/AppNavbar'
import MasterSidebar from '@/components/layout/MasterSidebar'
import { useAuthStore } from '@/store/useAuthStore'
import { userApi } from '@/api/userApi'
import type { PageProps } from '@/types'
import { toast } from 'react-hot-toast'

type ModuleTab = 'Sales' | 'Purchase' | 'Manufacturing' | 'Product'

export default function UserManagementDetailPage({ activePage, onNavigate }: PageProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<ModuleTab>('Sales')

  // Use auth store for current logged-in user
  const storeUser = useAuthStore((s: any) => s.user)
  const [users, setUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    userApi.getUsers()
      .then((res: any) => {
        const list = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : [])
        setUsers(list)
        // Default: show the currently logged-in user if found, else first
        const match = list.find((u: any) => u._id === storeUser?._id || u.email === storeUser?.email)
        setSelectedUser(match || list[0] || null)
      })
      .catch(() => toast.error('Failed to fetch users'))
      .finally(() => setIsLoading(false))
  }, [storeUser?._id, storeUser?.email])

  const renderVal = (val: string) => {
    if (val === 'yes') return <span className="text-slate-800 font-bold">âœ“</span>
    if (val === 'no') return <span className="text-slate-400 font-bold">âœ—</span>
    return <span className="text-slate-600 text-xs font-medium">{val}</span>
  }

  const renderTableHeaders = () => (
    <thead className="bg-slate-50 border-y border-slate-300">
      <tr>
        <th className="px-4 py-3 text-sm font-semibold text-slate-900 border-r border-slate-300 w-[30%]">Field</th>
        <th className="px-4 py-3 text-sm font-semibold text-slate-900 text-center border-r border-slate-300 w-[17.5%]">Create</th>
        <th className="px-4 py-3 text-sm font-semibold text-slate-900 text-center border-r border-slate-300 w-[17.5%]">View</th>
        <th className="px-4 py-3 text-sm font-semibold text-slate-900 text-center border-r border-slate-300 w-[17.5%]">Edit</th>
        <th className="px-4 py-3 text-sm font-semibold text-slate-900 text-center w-[17.5%]">Delete</th>
      </tr>
    </thead>
  )

  const renderSalesTable = () => (
    <table className="w-full text-left text-sm text-slate-600">
      {renderTableHeaders()}
      <tbody className="divide-y divide-slate-300">
        {[
          ['Customer', 'yes', 'yes', 'yes', 'yes'],
          ['Customer Address', 'yes', 'yes', 'yes', 'yes'],
          ['Sales Person', 'yes', 'yes', 'yes', 'yes'],
          ['Product', 'yes', 'yes', 'yes', 'yes'],
          ['Ordered Quantity', 'yes', 'yes', 'yes', 'yes'],
          ['Delivered Quantity', 'yes', 'yes', 'yes', 'yes'],
          ['Sales Price', 'yes', 'yes', 'yes', 'yes'],
          ['Status', 'yes', 'yes', 'yes', 'no'],
        ].map(([field, c, v, e, d], i) => (
          <tr key={i} className="hover:bg-slate-50 transition-colors">
            <td className="px-4 py-2 border-r border-slate-300 text-slate-800">{field}</td>
            <td className="px-4 py-2 border-r border-slate-300 text-center">{renderVal(c)}</td>
            <td className="px-4 py-2 border-r border-slate-300 text-center">{renderVal(v)}</td>
            <td className="px-4 py-2 border-r border-slate-300 text-center">{renderVal(e)}</td>
            <td className="px-4 py-2 text-center">{renderVal(d)}</td>
          </tr>
        ))}
        <tr className="hover:bg-slate-50 transition-colors">
          <td className="px-4 py-2 border-r border-slate-300 text-slate-800">Total</td>
          <td className="px-4 py-2 border-r border-slate-300 text-center">{renderVal('yes')}</td>
          <td className="px-4 py-2 border-r border-slate-300 text-center">{renderVal('yes')}</td>
          <td colSpan={2} className="px-4 py-2 text-center text-slate-600 text-xs font-medium border-l border-slate-300">Recomputed</td>
        </tr>
        <tr className="hover:bg-slate-50 transition-colors">
          <td className="px-4 py-2 border-r border-slate-300 text-slate-800">Creation Date</td>
          <td className="px-4 py-2 border-r border-slate-300 text-center text-xs font-medium">Auto Compute</td>
          <td className="px-4 py-2 border-r border-slate-300 text-center">{renderVal('yes')}</td>
          <td className="px-4 py-2 border-r border-slate-300 text-center">{renderVal('no')}</td>
          <td className="px-4 py-2 text-center">{renderVal('no')}</td>
        </tr>
      </tbody>
    </table>
  )

  const renderPurchaseTable = () => (
    <table className="w-full text-left text-sm text-slate-600">
      {renderTableHeaders()}
      <tbody className="divide-y divide-slate-300">
        {[
          ['Vendor', 'yes', 'yes', 'yes', 'yes'],
          ['Vendor Address', 'yes', 'yes', 'yes', 'yes'],
          ['Responsible Person', 'yes', 'yes', 'yes', 'yes'],
          ['Product', 'yes', 'yes', 'yes', 'yes'],
          ['Ordered Quantity', 'yes', 'yes', 'yes', 'yes'],
          ['Received Quantity', 'yes', 'yes', 'yes', 'yes'],
          ['Cost Price', 'yes', 'yes', 'yes', 'yes'],
        ].map(([field, c, v, e, d], i) => (
          <tr key={i} className="hover:bg-slate-50 transition-colors">
            <td className="px-4 py-2 border-r border-slate-300 text-slate-800">{field}</td>
            <td className="px-4 py-2 border-r border-slate-300 text-center">{renderVal(c)}</td>
            <td className="px-4 py-2 border-r border-slate-300 text-center">{renderVal(v)}</td>
            <td className="px-4 py-2 border-r border-slate-300 text-center">{renderVal(e)}</td>
            <td className="px-4 py-2 text-center">{renderVal(d)}</td>
          </tr>
        ))}
        <tr className="hover:bg-slate-50 transition-colors">
          <td className="px-4 py-2 border-r border-slate-300 text-slate-800">Total</td>
          <td className="px-4 py-2 border-r border-slate-300 text-center">{renderVal('yes')}</td>
          <td className="px-4 py-2 border-r border-slate-300 text-center">{renderVal('yes')}</td>
          <td colSpan={2} className="px-4 py-2 text-center text-slate-600 text-xs font-medium border-l border-slate-300">Auto Recomputed</td>
        </tr>
        <tr className="hover:bg-slate-50 transition-colors">
          <td className="px-4 py-2 border-r border-slate-300 text-slate-800">Creation Date</td>
          <td className="px-4 py-2 border-r border-slate-300 text-center text-xs font-medium">Auto Compute</td>
          <td className="px-4 py-2 border-r border-slate-300 text-center">{renderVal('yes')}</td>
          <td className="px-4 py-2 border-r border-slate-300 text-center">{renderVal('no')}</td>
          <td className="px-4 py-2 text-center">{renderVal('no')}</td>
        </tr>
      </tbody>
    </table>
  )

  const renderManufacturingTable = () => (
    <table className="w-full text-left text-sm text-slate-600">
      {renderTableHeaders()}
      <tbody className="divide-y divide-slate-300">
        {[
          ['Product to Manufacture', 'yes', 'yes', 'yes', 'yes'],
          ['Product Quantity', 'yes', 'yes', 'yes', 'yes'],
          ['BoM', 'yes', 'yes', 'yes', 'yes'],
          ['Responsible Person', 'yes', 'yes', 'yes', 'yes'],
          ['Finished Quantity', 'yes', 'yes', 'yes', 'yes'],
        ].map(([field, c, v, e, d], i) => (
          <tr key={i} className="hover:bg-slate-50 transition-colors">
            <td className="px-4 py-2 border-r border-slate-300 text-slate-800">{field}</td>
            <td className="px-4 py-2 border-r border-slate-300 text-center">{renderVal(c)}</td>
            <td className="px-4 py-2 border-r border-slate-300 text-center">{renderVal(v)}</td>
            <td className="px-4 py-2 border-r border-slate-300 text-center">{renderVal(e)}</td>
            <td className="px-4 py-2 text-center">{renderVal(d)}</td>
          </tr>
        ))}
        <tr className="hover:bg-slate-50 transition-colors">
          <td className="px-4 py-2 border-r border-slate-300 text-slate-800">Creation Date</td>
          <td className="px-4 py-2 border-r border-slate-300 text-center text-xs font-medium">Auto Compute</td>
          <td className="px-4 py-2 border-r border-slate-300 text-center">{renderVal('yes')}</td>
          <td className="px-4 py-2 border-r border-slate-300 text-center">{renderVal('no')}</td>
          <td className="px-4 py-2 text-center">{renderVal('no')}</td>
        </tr>
      </tbody>
    </table>
  )

  const renderProductTable = () => (
    <table className="w-full text-left text-sm text-slate-600">
      {renderTableHeaders()}
      <tbody className="divide-y divide-slate-300">
        {[
          ['Product Name', 'yes', 'yes', 'yes', 'yes'],
          ['SKU', 'yes', 'yes', 'yes', 'no'],
          ['Price', 'yes', 'yes', 'yes', 'no'],
        ].map(([field, c, v, e, d], i) => (
          <tr key={i} className="hover:bg-slate-50 transition-colors">
            <td className="px-4 py-2 border-r border-slate-300 text-slate-800">{field}</td>
            <td className="px-4 py-2 border-r border-slate-300 text-center">{renderVal(c)}</td>
            <td className="px-4 py-2 border-r border-slate-300 text-center">{renderVal(v)}</td>
            <td className="px-4 py-2 border-r border-slate-300 text-center">{renderVal(e)}</td>
            <td className="px-4 py-2 text-center">{renderVal(d)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  const displayUser = selectedUser

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <AppNavbar
        onToggleMenu={() => setIsSidebarOpen(true)}
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

      <main className="flex-1 p-6 flex justify-center">
        <div className="w-full max-w-3xl pt-4">

          {isLoading ? (
            <div className="text-center py-10 text-slate-500">Loading user details...</div>
          ) : !displayUser ? (
            <div className="text-center py-10 text-slate-400">No users found.</div>
          ) : (
            <div className="flex flex-col items-center">

              {/* User selector (if multiple users) */}
              {users.length > 1 && (
                <div className="w-full mb-4 flex items-center gap-3">
                  <label className="text-sm font-medium text-slate-600">Viewing:</label>
                  <select
                    className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={displayUser._id}
                    onChange={(e) => {
                      const found = users.find((u: any) => u._id === e.target.value)
                      if (found) setSelectedUser(found)
                    }}
                  >
                    {users.map((u: any) => (
                      <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Main card */}
              <div className="w-full rounded-[2.5rem] border-2 border-slate-400 bg-white shadow-sm overflow-hidden flex flex-col mb-6 pb-8 relative mt-2">

                <div className="text-center py-6">
                  <h1 className="text-lg text-slate-800 italic tracking-wide" style={{ fontFamily: 'cursive' }}>
                    User Management Form View
                  </h1>
                </div>

                <div className="px-8 flex flex-col md:flex-row justify-between gap-8 relative mt-2">
                  <div className="flex-1">

                    {/* Info fields â€” real data from DB */}
                    <div className="relative p-5 border-2 border-dotted border-slate-400 rounded-3xl">
                      <div className="space-y-4">
                        <div className="flex text-sm font-medium">
                          <span className="w-36 text-slate-600">Name :</span>
                          <span className="text-slate-800 italic" style={{ fontFamily: 'cursive' }}>
                            {displayUser.name || 'â€”'}
                          </span>
                        </div>
                        <div className="flex text-sm font-medium">
                          <span className="w-36 text-slate-600">Email ID:</span>
                          <span className="text-slate-800 italic" style={{ fontFamily: 'cursive' }}>
                            {displayUser.email || 'â€”'}
                          </span>
                        </div>
                        <div className="flex text-sm font-medium">
                          <span className="w-36 text-slate-600">Role:</span>
                          <span className="text-slate-800 italic" style={{ fontFamily: 'cursive' }}>
                            {displayUser.role?.replace(/_/g, ' ') || 'â€”'}
                          </span>
                        </div>
                        <div className="flex text-sm font-medium">
                          <span className="w-36 text-slate-600">Member Since:</span>
                          <span className="text-slate-800 italic" style={{ fontFamily: 'cursive' }}>
                            {displayUser.createdAt ? new Date(displayUser.createdAt).toLocaleDateString() : 'â€”'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pl-5 flex items-center">
                      <div className="flex text-sm font-medium">
                        <span className="w-36 text-slate-600">Position:</span>
                        <span className="text-slate-800 italic" style={{ fontFamily: 'cursive' }}>
                          {displayUser.role?.replace(/_/g, ' ') || 'â€”'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Avatar block */}
                  <div className="shrink-0 flex items-start justify-end mr-4">
                    <div className="relative h-40 w-32 rounded-3xl border-2 border-slate-400 bg-slate-50 flex flex-col items-center justify-center gap-2">
                      <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
                        {(displayUser.name || displayUser.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <button
                        onClick={() => toast('Edit photo clicked')}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-slate-400 mt-8 w-full"></div>

                {/* Permissions Tabs */}
                <div className="px-8 pt-4 flex gap-2">
                  {(['Sales', 'Purchase', 'Manufacturing', 'Product'] as ModuleTab[]).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-1.5 text-sm font-medium rounded-md border-2 border-slate-400 transition-colors ${
                        activeTab === tab
                          ? 'bg-blue-200 text-slate-900 shadow-sm'
                          : 'bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="px-8 pt-4 w-full">
                  <div className="border-2 border-slate-400 rounded-lg overflow-hidden">
                    {activeTab === 'Sales' && renderSalesTable()}
                    {activeTab === 'Purchase' && renderPurchaseTable()}
                    {activeTab === 'Manufacturing' && renderManufacturingTable()}
                    {activeTab === 'Product' && renderProductTable()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

