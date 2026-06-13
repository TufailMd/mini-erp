import { useState } from 'react'
import AppNavbar from '@/components/layout/AppNavbar'
import MasterSidebar from '@/components/layout/MasterSidebar'
import UserProfileDrawer from '@/components/layout/UserProfileDrawer'
import ModuleOverviewSection from '@/modules/dashboard/components/ModuleOverviewSection'
import { userProfileData } from '@/data/newDashboardData'
import { useErp } from '@/context/ErpContext'
import { toast } from 'react-hot-toast'
import type { PageProps, UserProfile, ModuleMetrics } from '@/types'

export default function DashboardPage({ activePage, onNavigate }: PageProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [profile, setProfile] = useState<UserProfile>(userProfileData)

  const { salesOrders, purchaseOrders, manufacturingOrders } = useErp()

  // Dynamic Metrics Generation
  const saleOrdersMetrics: ModuleMetrics = {
    title: 'Sale Orders',
    all: [
      { label: 'Total', count: salesOrders.length },
      { label: 'Confirmed', count: salesOrders.filter(so => so.status === 'Confirmed').length, isActive: true },
      { label: 'Pending Deliveries', count: salesOrders.filter(so => so.status !== 'Completed').length },
      { label: 'Completed', count: salesOrders.filter(so => so.status === 'Completed').length }
    ],
    my: [{ label: 'Total', count: salesOrders.length }]
  }

  const purchaseOrdersMetrics: ModuleMetrics = {
    title: 'Purchase Orders',
    all: [
      { label: 'Total', count: purchaseOrders.length },
      { label: 'Confirmed', count: purchaseOrders.filter(po => po.status === 'Confirmed').length, isActive: true },
      { label: 'Partial Receipts', count: purchaseOrders.filter(po => po.status === 'Partially Processed').length },
      { label: 'Completed', count: purchaseOrders.filter(po => po.status === 'Completed').length }
    ],
    my: [{ label: 'Total', count: purchaseOrders.length }]
  }

  const manufacturingOrdersMetrics: ModuleMetrics = {
    title: 'Manufacturing Orders',
    all: [
      { label: 'Total', count: manufacturingOrders.length },
      { label: 'Confirmed', count: manufacturingOrders.filter(mo => mo.status === 'Confirmed').length, isActive: true },
      { label: 'In-progress', count: manufacturingOrders.filter(mo => mo.status === 'Partially Processed').length },
      { label: 'Completed', count: manufacturingOrders.filter(mo => mo.status === 'Completed').length }
    ],
    my: [{ label: 'Total', count: manufacturingOrders.length }]
  }

  const handleFilterClick = (moduleName: string, statusLabel: string) => {
    toast(`Filter Applied: ${moduleName} - ${statusLabel}`)
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Top Navbar */}
      <AppNavbar 
        onToggleMenu={() => setIsSidebarOpen(true)}
        onToggleProfile={() => setIsProfileOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateNew={() => onNavigate('sales-order-create')} // Defaulting to sales order create for the + button
      />

      {/* Slide-out Navigation Menu (Left) */}
      <MasterSidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activePage={activePage}
        onNavigate={onNavigate}
      />

      {/* Slide-out User Profile Drawer (Right) */}
      <UserProfileDrawer 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSaveProfile={setProfile}
      />

      {/* Main Dashboard Content */}
      <main className="flex-1 p-6 flex justify-center">
        <div className="w-full max-w-4xl pt-4">
          <ModuleOverviewSection 
            metrics={saleOrdersMetrics} 
            onFilterClick={(status) => handleFilterClick('Sale Orders', status)} 
          />
          <ModuleOverviewSection 
            metrics={purchaseOrdersMetrics} 
            onFilterClick={(status) => handleFilterClick('Purchase Orders', status)} 
          />
          <ModuleOverviewSection 
            metrics={manufacturingOrdersMetrics} 
            onFilterClick={(status) => handleFilterClick('Manufacturing Orders', status)} 
          />
        </div>
      </main>
    </div>
  )
}
