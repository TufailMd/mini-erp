import { useState, useEffect } from 'react'
import { defaultPageId, resolvePage } from '@/config/pageRegistry'
import type { PageId, UserProfile } from '@/types'
import { useAuth } from '@/context/AuthContext'
import { useAuthStore } from '@/store/useAuthStore'
import { motion, AnimatePresence } from 'framer-motion'
import UserProfileDrawer from '@/components/layout/UserProfileDrawer'

export default function StitchConversion() {
  const [activePage, setActivePage] = useState<PageId>(defaultPageId)
  const { isAuthenticated, user: authUser } = useAuth()
  const { user: storeUser, isProfileOpen, setProfileOpen } = useAuthStore()

  useEffect(() => {
    // If not authenticated and trying to access a protected page, redirect to login
    if (!isAuthenticated && activePage !== 'login' && activePage !== 'signup' && activePage !== 'forgot-password') {
      setActivePage('login')
    }
  }, [isAuthenticated, activePage])

  const PageComponent = resolvePage(activePage)

  const profileToUse: UserProfile = storeUser || {
    name: authUser?.email?.split('@')[0] || 'Admin User',
    email: authUser?.email || 'admin@example.com',
    address: 'HQ Office',
    mobile: '+1 234 567 8900',
    position: authUser?.role || 'System Administrator',
  }

  return (
    <>
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
      
      {isAuthenticated && (
        <UserProfileDrawer 
          isOpen={isProfileOpen}
          onClose={() => setProfileOpen(false)}
          profile={profileToUse}
          onSaveProfile={() => {}}
        />
      )}
    </>
  )
}
