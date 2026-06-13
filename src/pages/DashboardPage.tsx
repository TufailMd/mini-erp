import { useState, useEffect } from 'react'
import NexusSidebar from '../components/dashboard/NexusSidebar'
import NexusHeader from '../components/dashboard/NexusHeader'
import StatCards from '../components/dashboard/StatCards'
import PerformanceChart from '../components/dashboard/PerformanceChart'
import PendingOrdersTable from '../components/dashboard/PendingOrdersTable'
import AlertsSection from '../components/dashboard/AlertsSection'
import ActivityFeed from '../components/dashboard/ActivityFeed'
import {
  nexusNavSections,
  statCards,
  weeklyChartData,
  monthlyChartData,
  pendingOrders,
  stockAlerts,
  recentActivity,
} from '../data/dashboardData'
import type { ChartPeriod, PageProps } from '../types'

export default function DashboardPage({ activePage, onNavigate }: PageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('weekly')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleButtonClick = () => {
    console.log('clicked')
  }

  const chartData =
    chartPeriod === 'weekly' ? weeklyChartData : monthlyChartData

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <NexusSidebar
        sections={nexusNavSections}
        activePage={activePage}
        onNavigate={onNavigate}
      />

      <div className="ml-64 flex min-h-screen flex-col">
        <NexusHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onButtonClick={handleButtonClick}
        />

        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Command Center</h1>
            <p className="mt-1 text-sm text-gray-500">
              Overview of your operations for today, Oct 24, 2023
            </p>
          </div>

          <div className="mb-6">
            <StatCards cards={statCards} />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="space-y-6 xl:col-span-2">
              <PerformanceChart
                data={chartData}
                period={chartPeriod}
                loading={loading}
                onPeriodChange={setChartPeriod}
              />
              <PendingOrdersTable
                orders={pendingOrders}
                loading={loading}
                onViewAllClick={handleButtonClick}
              />
            </div>

            <div className="space-y-6">
              <AlertsSection alerts={stockAlerts} />
              <ActivityFeed activities={recentActivity} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
