import type { ModuleMetrics, StatusCount } from '../../types'
import { motion } from 'framer-motion'

interface ModuleOverviewSectionProps {
  metrics: ModuleMetrics
  onFilterClick: (status: string, filterContext: 'All' | 'My') => void
}

function StatusChip({ status, onClick }: { status: StatusCount; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative overflow-hidden flex flex-col items-center justify-center min-w-[90px] px-4 py-3 rounded-xl border transition-all duration-300 ${
        status.isActive 
          ? 'border-indigo-500/30 bg-indigo-50/80 shadow-premium' 
          : 'border-slate-200/60 bg-white/60 hover:border-indigo-300 hover:bg-slate-50/80 hover:shadow-sm'
      }`}
    >
      {/* Subtle shine effect if active */}
      {status.isActive && (
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
      )}
      
      <span className={`text-2xl font-bold tracking-tight ${status.isActive ? 'text-indigo-600' : 'text-slate-800'}`}>
        {status.count}
      </span>
      <span className={`text-xs mt-1 tracking-wide ${status.isActive ? 'text-indigo-500 font-semibold uppercase' : 'text-slate-500 font-medium'}`}>
        {status.label}
      </span>
    </motion.button>
  )
}

export default function ModuleOverviewSection({ metrics, onFilterClick }: ModuleOverviewSectionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full rounded-2xl border border-white/40 bg-white/40 backdrop-blur-xl shadow-premium overflow-hidden flex flex-col mb-8"
    >
      {/* Module Title */}
      <div className="border-b border-slate-200/50 bg-gradient-to-r from-slate-100/50 to-white/50 py-4 px-6 flex justify-between items-center">
        <h3 className="text-base font-bold tracking-tight text-slate-800">{metrics.title}</h3>
        <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-full uppercase tracking-wider">Active</span>
      </div>
      
      <div className="flex flex-col divide-y divide-slate-100/50">
        {/* All Row */}
        <div className="flex items-center p-5">
          <div className="w-16 shrink-0 flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Org</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 pl-4 flex-1">
            {metrics.all.map((status, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                key={`all-${status.label}`}
              >
                <StatusChip 
                  status={status} 
                  onClick={() => onFilterClick(status.label, 'All')} 
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* My Row */}
        <div className="flex items-center p-5 bg-indigo-50/10">
          <div className="w-16 shrink-0 flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Me</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 pl-4 flex-1">
            {metrics.my.map((status, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + (index * 0.05) }}
                key={`my-${status.label}`}
              >
                <StatusChip 
                  status={status} 
                  onClick={() => onFilterClick(status.label, 'My')} 
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
