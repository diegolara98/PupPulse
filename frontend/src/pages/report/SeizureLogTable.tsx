import {
  Table, TableHead, TableBody, TableRow, TableCell, Box, Typography,
} from '@mui/material'
import type { SeizureRecord } from '../../types'
import { SEVERITY_COLORS, formatDuration, formatDate, formatTime } from '../../lib/seizureUtils'
import { seizureLogTableStyles as s } from './SeizureLogTable.styles'

interface Props {
  records: SeizureRecord[]
}

export default function SeizureLogTable({ records }: Props) {
  if (records.length === 0) {
    return <Typography sx={s.empty}>No seizures recorded in this period.</Typography>
  }

  return (
    <Table size="small" sx={s.table}>
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Time</TableCell>
          <TableCell>Duration</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Severity</TableCell>
          <TableCell>Emergency Meds</TableCell>
          <TableCell>Notes</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {records.map(r => (
          <TableRow key={r.id}>
            <TableCell>{formatDate(r.occurred_at)}</TableCell>
            <TableCell>{formatTime(r.occurred_at)}</TableCell>
            <TableCell>{formatDuration(r.duration_seconds)}</TableCell>
            <TableCell>{r.seizure_type ?? '—'}</TableCell>
            <TableCell>
              {r.severity ? (
                <Box component="span" sx={s.severityBadge(SEVERITY_COLORS[r.severity] ?? '#666')}>
                  {r.severity}
                </Box>
              ) : '—'}
            </TableCell>
            <TableCell>{r.emergency_meds_given ? `Yes — ${r.emergency_med_name ?? 'given'}` : 'No'}</TableCell>
            <TableCell>
              <Box sx={s.noteText} title={r.notes ?? ''}>
                {r.notes ?? '—'}
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
