import { useState, useEffect, useCallback } from 'react'
import {
  Box, Typography, Card, CardContent, Chip, Divider,
  CircularProgress, Alert, IconButton, Collapse, TextField,
  MenuItem, Button,
} from '@mui/material'
import { supabase } from '../lib/supabase'
import {
  SEVERITY_COLORS, formatDuration, formatDate, formatTime,
} from '../lib/seizureUtils'
import type { SeizureRecord } from '../types'
import { historyStyles as s } from './History.styles'

interface HistoryProps {
  userId: string
}

export default function History({ userId }: HistoryProps) {
  const [records, setRecords] = useState<SeizureRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Filter state — both default to '' which means "show all"
  const [filterSeverity, setFilterSeverity] = useState('')
  const [filterType, setFilterType] = useState('')

  /**
   * Re-runs whenever a filter changes. useCallback prevents the useEffect
   * below from firing on every render; only the filters themselves trigger a refetch.
   */
  const fetchRecords = useCallback(async () => {
    setLoading(true)
    setError(null)

    let query = supabase
      .from('seizures')
      .select('*')
      .eq('user_id', userId)
      .order('occurred_at', { ascending: false })

    // Only add filter clauses when a value is actually selected
    if (filterSeverity) query = query.eq('severity', filterSeverity)
    if (filterType) query = query.eq('seizure_type', filterType)

    const { data, error } = await query
    setLoading(false)

    if (error) setError(error.message)
    else setRecords(data ?? [])
  }, [userId, filterSeverity, filterType])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  // Toggle a record's detail panel open/closed
  const toggleExpand = (id: string) =>
    setExpandedId(prev => (prev === id ? null : id))

  const filtersActive = filterSeverity || filterType

  return (
    <Box sx={s.wrapper}>
      <Typography variant="h5" sx={s.pageTitle}>
        Seizure History
      </Typography>

      {/* Filters */}
      <Box sx={s.filterRow}>
        <TextField
          select
          label="Severity"
          value={filterSeverity}
          onChange={e => setFilterSeverity(e.target.value)}
          size="small"
          sx={s.filterField}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Mild">Mild</MenuItem>
          <MenuItem value="Moderate">Moderate</MenuItem>
          <MenuItem value="Severe">Severe</MenuItem>
        </TextField>
        <TextField
          select
          label="Type"
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          size="small"
          sx={s.filterField}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Grand Mal">Grand Mal</MenuItem>
          <MenuItem value="Focal">Focal</MenuItem>
          <MenuItem value="Absence">Absence</MenuItem>
          <MenuItem value="Unknown">Unknown</MenuItem>
        </TextField>
        {filtersActive && (
          <Button
            size="small"
            onClick={() => { setFilterSeverity(''); setFilterType('') }}
            sx={s.clearButton}
          >
            Clear filters
          </Button>
        )}
      </Box>

      {loading && (
        <Box sx={s.centered}><CircularProgress /></Box>
      )}

      {error && (
        <Alert severity="error" sx={s.alert}>{error}</Alert>
      )}

      {!loading && !error && records.length === 0 && (
        <Card elevation={2} sx={s.emptyCard}>
          <CardContent>
            <Typography color="text.secondary">
              {filtersActive
                ? 'No records match the current filters.'
                : 'No seizures logged yet. Use "Log Seizure" to add your first entry.'}
            </Typography>
          </CardContent>
        </Card>
      )}

      {records.map((rec) => (
        <Card key={rec.id} elevation={2} sx={s.recordCard}>
          <CardContent sx={s.cardContent}>

            {/* Summary row — always visible */}
            <Box sx={s.summaryRow}>
              <Box>
                <Typography fontWeight={600}>{formatDate(rec.occurred_at)}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatTime(rec.occurred_at)}
                </Typography>
              </Box>

              <Box sx={s.chips}>
                {rec.severity && (
                  <Chip
                    label={rec.severity}
                    size="small"
                    sx={s.severityChip(SEVERITY_COLORS[rec.severity] ?? '#666')}
                  />
                )}
                {rec.seizure_type && (
                  <Chip label={rec.seizure_type} size="small" variant="outlined" />
                )}
                <Chip
                  label={formatDuration(rec.duration_seconds)}
                  size="small"
                  variant="outlined"
                />
              </Box>

              <IconButton
                size="small"
                onClick={() => toggleExpand(rec.id)}
                sx={s.expandButton}
                aria-label="expand details"
              >
                {expandedId === rec.id ? '▲' : '▼'}
              </IconButton>
            </Box>

            {/* Detail panel — revealed on expand */}
            <Collapse in={expandedId === rec.id}>
              <Divider sx={s.divider} />
              <Box sx={s.detailsGrid}>

                {rec.during_symptoms.length > 0 && (
                  <Box>
                    <Typography variant="caption" sx={s.detailLabel}>During</Typography>
                    <Typography variant="body2">{rec.during_symptoms.join(', ')}</Typography>
                  </Box>
                )}

                {rec.warning_signs.length > 0 && (
                  <Box>
                    <Typography variant="caption" sx={s.detailLabel}>Warning Signs</Typography>
                    <Typography variant="body2">{rec.warning_signs.join(', ')}</Typography>
                  </Box>
                )}

                {(rec.recovery_duration_minutes != null || rec.recovery_symptoms.length > 0) && (
                  <Box>
                    <Typography variant="caption" sx={s.detailLabel}>Recovery</Typography>
                    <Typography variant="body2">
                      {rec.recovery_duration_minutes != null
                        ? `${rec.recovery_duration_minutes} min`
                        : ''}
                      {rec.recovery_symptoms.length > 0
                        ? ` — ${rec.recovery_symptoms.join(', ')}`
                        : ''}
                    </Typography>
                  </Box>
                )}

                {rec.is_cluster && (
                  <Box>
                    <Typography variant="caption" sx={s.detailLabel}>Cluster</Typography>
                    <Typography variant="body2">
                      Yes{rec.cluster_count ? ` (${rec.cluster_count} in 24h)` : ''}
                    </Typography>
                  </Box>
                )}

                {rec.emergency_meds_given && (
                  <Box>
                    <Typography variant="caption" sx={s.detailLabel}>Emergency Meds</Typography>
                    <Typography variant="body2">
                      {rec.emergency_med_name ?? 'Given'}
                      {rec.emergency_med_time
                        ? ` at ${formatTime(rec.emergency_med_time)}`
                        : ''}
                    </Typography>
                  </Box>
                )}

                {rec.triggers.length > 0 && (
                  <Box>
                    <Typography variant="caption" sx={s.detailLabel}>Triggers</Typography>
                    <Typography variant="body2">{rec.triggers.join(', ')}</Typography>
                  </Box>
                )}

                {rec.notes && (
                  <Box sx={s.notesBox}>
                    <Typography variant="caption" sx={s.detailLabel}>Notes</Typography>
                    <Typography variant="body2">{rec.notes}</Typography>
                  </Box>
                )}

              </Box>
            </Collapse>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}
