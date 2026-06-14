import { useState, useEffect } from 'react'
import AppNavbar from '@/components/layout/AppNavbar'
import MasterSidebar from '@/components/layout/MasterSidebar'
import UserProfileDrawer from '@/components/layout/UserProfileDrawer'
import ModuleOverviewSection from '@/modules/dashboard/components/ModuleOverviewSection'
import { useAuthStore } from '@/store/useAuthStore'
import { dashboardApi } from '@/api/dashboardApi'
import { toast } from 'react-hot-toast'
import type { PageProps, ModuleMetrics } from '@/types'

export default function DashboardPage({ activePage, onNavigate }: PageProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [metrics, setMetrics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const { user } = useAuthStore()

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await dashboardApi.getMetrics()
        setMetrics(data)
      } catch (err: any) {
        toast.error(err.message || 'Failed to load dashboard metrics')
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  // Dynamic Metrics Generation
  const saleOrdersMetrics: ModuleMetrics = {
    title: 'Sale Orders',
    all: [
      { label: 'Total', count: metrics?.salesMetrics?.total || 0 },
      { label: 'Confirmed', count: metrics?.salesMetrics?.confirmed || 0, isActive: true },
      { label: 'Pending Deliveries', count: metrics?.salesMetrics?.pending || 0 },
      { label: 'Completed', count: metrics?.salesMetrics?.completed || 0 }
    ],
    my: [{ label: 'Total', count: metrics?.salesMetrics?.total || 0 }]
  }

  const purchaseOrdersMetrics: ModuleMetrics = {
    title: 'Purchase Orders',
    all: [
      { label: 'Total', count: metrics?.purchaseMetrics?.total || 0 },
      { label: 'Confirmed', count: metrics?.purchaseMetrics?.confirmed || 0, isActive: true },
      { label: 'Partial Receipts', count: metrics?.purchaseMetrics?.partial || 0 },
      { label: 'Completed', count: metrics?.purchaseMetrics?.completed || 0 }
    ],
    my: [{ label: 'Total', count: metrics?.purchaseMetrics?.total || 0 }]
  }

  const manufacturingOrdersMetrics: ModuleMetrics = {
    title: 'Manufacturing Orders',
    all: [
      { label: 'Total', count: metrics?.manufacturingMetrics?.total || 0 },
      { label: 'Confirmed', count: metrics?.manufacturingMetrics?.confirmed || 0, isActive: true },
      { label: 'In-progress', count: metrics?.manufacturingMetrics?.inProgress || 0 },
      { label: 'Completed', count: metrics?.manufacturingMetrics?.completed || 0 }
    ],
    my: [{ label: 'Total', count: metrics?.manufacturingMetrics?.total || 0 }]
  }

  const handleFilterClick = (moduleName: string, statusLabel: string) => {
    toast(`Filter Applied: ${moduleName} - ${statusLabel}`)
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Top Navbar */}
      <AppNavbar 
        onToggleMenu={() => setIsSidebarOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateNew={() => onNavigate('sales-order-create')}
      />

      {/* Slide-out Navigation Menu (Left) */}
      <MasterSidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activePage={activePage}
        onNavigate={onNavigate}
      />

      {/* Main Dashboard Content */}
      <main className="flex-1 p-6 flex justify-center">
        <div className="w-full max-w-4xl pt-4">
          {isLoading ? (
            <div className="text-center py-10 text-gray-500">Loading Dashboard...</div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </main>
    </div>
  )
}
