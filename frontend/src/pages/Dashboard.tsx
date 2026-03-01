import { useState, useEffect } from 'react'
import {
  Box, Typography, Card, CardContent, Button,
  Divider, CircularProgress, Alert,
} from '@mui/material'
import { supabase } from '../lib/supabase'
import {
  SEVERITY_COLORS, formatDuration, formatDate, formatTime,
  formatRelativeDate, calcAvgPerMonth,
} from '../lib/seizureUtils'
import type { Page, SeizureRecord } from '../types'
import { dashboardStyles as s } from './Dashboard.styles'

interface DashboardProps {
  onNavigate: (page: Page) => void
  userId: string
}

// Dashboard only needs these three fields — a lighter fetch than History's full select
type SeizureSummary = Pick<SeizureRecord, 'occurred_at' | 'duration_seconds' | 'severity'>

export default function Dashboard({ onNavigate, userId }: DashboardProps) {
  const [records, setRecords] = useState<SeizureSummary[]>([])
  const [profileComplete, setProfileComplete] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch seizures and profile in parallel — both are needed before we stop loading
    Promise.all([
      supabase
        .from('seizures')
        .select('occurred_at, duration_seconds, severity')
        .eq('user_id', userId)
        .order('occurred_at', { ascending: false }),
      supabase
        .from('profiles')
        .select('dog_name')
        .eq('id', userId)
        .single(),
    ]).then(([seizuresResult, profileResult]) => {
      setLoading(false)
      if (seizuresResult.error) setError(seizuresResult.error.message)
      else setRecords(seizuresResult.data ?? [])
      // Show nudge if dog_name hasn't been filled in yet
      setProfileComplete(!!profileResult.data?.dog_name)
    })
  }, [userId])

  // Derive stats from the fetched list — no extra queries needed
  const recent = records.slice(0, 5)
  const lastSeizure = records[0] ? formatRelativeDate(records[0].occurred_at) : '—'
  const avgPerMonth = calcAvgPerMonth(records)

  return (
    <Box>
      <Typography variant="h5" sx={s.pageTitle}>
        Dashboard
      </Typography>

      {!loading && !profileComplete && (
        <Alert
          severity="info"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => onNavigate('profile')}>
              Set up
            </Button>
          }
        >
          Add your dog's info and vet details to unlock full report generation.
        </Alert>
      )}

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box sx={s.statsRow}>
        <Card sx={s.statCard} elevation={2}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total Seizures
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={s.statValue}>
              {loading ? <CircularProgress size={28} /> : records.length || '—'}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={s.statCard} elevation={2}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Last Seizure
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={s.statValue}>
              {loading ? <CircularProgress size={28} /> : lastSeizure}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={s.statCard} elevation={2}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Avg / Month
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={s.statValue}>
              {loading ? <CircularProgress size={28} /> : avgPerMonth}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Typography variant="h6" fontWeight={600} mb={2}>
        Recent Activity
      </Typography>
      <Card sx={s.recentCard} elevation={2}>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress />
            </Box>
          ) : recent.length === 0 ? (
            <Typography color="text.secondary">No seizures logged yet.</Typography>
          ) : (
            recent.map((entry, i) => (
              <Box key={entry.occurred_at + i}>
                <Box sx={s.recentRow}>
                  <Typography fontWeight={500}>
                    {formatDate(entry.occurred_at)} · {formatTime(entry.occurred_at)}
                  </Typography>
                  <Box sx={s.recentMeta}>
                    <Typography color="text.secondary">
                      {formatDuration(entry.duration_seconds)}
                    </Typography>
                    {entry.severity && (
                      <Typography sx={s.severityText(SEVERITY_COLORS[entry.severity] ?? '#888')}>
                        {entry.severity}
                      </Typography>
                    )}
                  </Box>
                </Box>
                {i < recent.length - 1 && <Divider />}
              </Box>
            ))
          )}
        </CardContent>
      </Card>

      <Button
        variant="contained"
        size="large"
        onClick={() => onNavigate('log')}
        sx={s.ctaButton}
      >
        + Log New Seizure
      </Button>
    </Box>
  )
}
