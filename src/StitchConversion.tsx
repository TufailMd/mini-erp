import { useState, useEffect } from 'react'
import { defaultPageId, resolvePage } from './config/pageRegistry'
import type { PageId } from './types'
import { useAuth } from './context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function StitchConversion() {
  const [activePage, setActivePage] = useState<PageId>(defaultPageId)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    // If not authenticated and trying to access a protected page, redirect to login
    if (!isAuthenticated && activePage !== 'login' && activePage !== 'signup' && activePage !== 'forgot-password') {
      setActivePage('login')
    }
  }, [isAuthenticated, activePage])

  const PageComponent = resolvePage(activePage)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activePage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="min-h-screen bg-slate-50"
      >
        <PageComponent activePage={activePage} onNavigate={setActivePage} />
      </motion.div>
    </AnimatePresence>
  )
}
