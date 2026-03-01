import { useState, useEffect } from 'react'
import { Box, CircularProgress } from '@mui/material'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import type { Page } from './types'
import TopBar from './components/TopBar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import LogSeizure from './pages/log-seizure'
import History from './pages/History'
import Reports from './pages/Reports'
import Profile from './pages/Profile'
import Auth from './pages/Auth'
import { appStyles as s } from './App.styles'

const SIDEBAR_WIDTH = 220

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [logStartTime, setLogStartTime] = useState<Date>(new Date())

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const navigateTo = (page: Page) => {
    // Capture the timestamp here rather than inside LogSeizure so the default
    // date/time reflects when the user *decided* to log, not when the form rendered
    if (page === 'log') setLogStartTime(new Date())
    setCurrentPage(page)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (authLoading) {
    return (
      <Box sx={s.loading}>
        <CircularProgress />
      </Box>
    )
  }

  if (!session) {
    return <Auth />
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={navigateTo} userId={session.user.id} />
      case 'log':       return <LogSeizure startedAt={logStartTime} userId={session.user.id} />
      case 'history':   return <History userId={session.user.id} />
      case 'reports':   return <Reports userId={session.user.id} />
      case 'profile':   return <Profile userId={session.user.id} />
    }
  }

  return (
    <Box sx={s.root}>
      <TopBar userEmail={session.user.email} onSignOut={handleSignOut} />
      <Box sx={s.body}>
        <Sidebar currentPage={currentPage} onNavigate={navigateTo} width={SIDEBAR_WIDTH} />
        <Box component="main" sx={s.main}>
          {renderPage()}
        </Box>
      </Box>
    </Box>
  )
}

export default App
