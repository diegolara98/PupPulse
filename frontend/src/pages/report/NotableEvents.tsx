import { Box, Typography } from '@mui/material'
import type { SeizureRecord } from '../../types'
import { formatDate, formatTime, formatDuration } from '../../lib/seizureUtils'
import { notableEventsStyles as s } from './NotableEvents.styles'

interface Props {
  records: SeizureRecord[]
}

export default function NotableEvents({ records }: Props) {
  const clusters      = records.filter(r => r.is_cluster)
  const emergencyMeds = records.filter(r => r.emergency_meds_given)
  const longSeizures  = records.filter(r => (r.duration_seconds ?? 0) >= 300)

  const hasAnything = clusters.length > 0 || emergencyMeds.length > 0 || longSeizures.length > 0

  if (!hasAnything) {
    return <Typography sx={s.none}>No cluster events, emergency medications, or prolonged seizures in this period.</Typography>
  }

  return (
    <Box sx={s.grid}>
      {/* Cluster events */}
      <Box sx={s.card}>
        <Typography sx={s.count}>{clusters.length}</Typography>
        <Typography sx={s.cardLabel}>Cluster Event{clusters.length !== 1 ? 's' : ''}</Typography>
        {clusters.slice(0, 3).map(r => (
          <Typography key={r.id} sx={s.detail}>
            {formatDate(r.occurred_at)}{r.cluster_count ? ` · ${r.cluster_count} in 24h` : ''}
          </Typography>
        ))}
        {clusters.length > 3 && (
          <Typography sx={s.detail}>+{clusters.length - 3} more</Typography>
        )}
      </Box>

      {/* Emergency medications */}
      <Box sx={s.card}>
        <Typography sx={s.count}>{emergencyMeds.length}</Typography>
        <Typography sx={s.cardLabel}>Emergency Med{emergencyMeds.length !== 1 ? 's' : ''} Given</Typography>
        {emergencyMeds.slice(0, 3).map(r => (
          <Typography key={r.id} sx={s.detail}>
            {formatDate(r.occurred_at)}{r.emergency_med_name ? ` · ${r.emergency_med_name}` : ''}
            {r.emergency_med_time ? ` at ${formatTime(r.emergency_med_time)}` : ''}
          </Typography>
        ))}
        {emergencyMeds.length > 3 && (
          <Typography sx={s.detail}>+{emergencyMeds.length - 3} more</Typography>
        )}
      </Box>

      {/* Long seizures (≥5 min) */}
      <Box sx={s.card}>
        <Typography sx={s.count}>{longSeizures.length}</Typography>
        <Typography sx={s.cardLabel}>Seizure{longSeizures.length !== 1 ? 's' : ''} ≥ 5 Minutes</Typography>
        {longSeizures.slice(0, 3).map(r => (
          <Typography key={r.id} sx={s.detail}>
            {formatDate(r.occurred_at)} · {formatDuration(r.duration_seconds)}
          </Typography>
        ))}
        {longSeizures.length > 3 && (
          <Typography sx={s.detail}>+{longSeizures.length - 3} more</Typography>
        )}
      </Box>
    </Box>
  )
}
