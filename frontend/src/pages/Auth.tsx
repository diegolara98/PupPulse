import { useState } from 'react'
import {
  Box, Card, CardContent, Typography, TextField,
  Button, Alert, CircularProgress, Link,
} from '@mui/material'
import { supabase } from '../lib/supabase'
import { authStyles as s } from './Auth.styles'
import pupPulseLogo from '../assets/PupPulseIcon.svg'

export default function Auth() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setSuccessMsg(null)

    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else {
        setSuccessMsg('Account created — check your email to confirm before signing in.')
      }
    }

    setLoading(false)
  }

  const switchMode = () => {
    setMode(prev => prev === 'signin' ? 'signup' : 'signin')
    setError(null)
    setSuccessMsg(null)
  }

  return (
    <Box sx={s.root}>
      <Card sx={s.card} elevation={4}>
        <CardContent sx={s.cardContent}>
          <Box sx={s.logoRow}>
            <Box component="img" src={pupPulseLogo} alt="PupPulse" sx={s.logo} />
            <Typography variant="h5" sx={s.appName}>PupPulse</Typography>
          </Box>

          <Typography variant="h6" sx={s.heading}>
            {mode === 'signin' ? 'Sign in to your account' : 'Create an account'}
          </Typography>

          {error && <Alert severity="error" sx={s.alert}>{error}</Alert>}
          {successMsg && <Alert severity="success" sx={s.alert}>{successMsg}</Alert>}

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            sx={s.field}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            fullWidth
            sx={s.field}
          />

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleSubmit}
            disabled={loading || !email || !password}
            sx={s.submitButton}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
          >
            {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </Button>

          <Typography variant="body2" sx={s.toggleRow}>
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <Link component="button" onClick={switchMode} sx={s.toggleLink}>
              {mode === 'signin' ? 'Sign Up' : 'Sign In'}
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
