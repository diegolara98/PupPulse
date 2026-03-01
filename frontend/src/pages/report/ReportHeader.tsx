import { Box, Typography } from '@mui/material'
import type { TimeRange } from './reportUtils'
import { TIME_RANGE_LABELS, getRangeStart } from './reportUtils'
import { reportHeaderStyles as s } from './ReportHeader.styles'

interface Props {
  range: TimeRange
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ReportHeader({ range }: Props) {
  const now = new Date()
  const start = getRangeStart(range)
  const periodLabel = start ? `${formatDate(start)} – ${formatDate(now)}` : `Through ${formatDate(now)}`

  return (
    <Box sx={s.root}>
      <Box>
        <Box sx={s.brand}>
          <Typography sx={s.paw}>🐾</Typography>
          <Typography sx={s.brandName}>PupPulse</Typography>
        </Box>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography sx={s.title}>Seizure Activity Report</Typography>
        <Typography sx={s.rangeLine}>{TIME_RANGE_LABELS[range]}</Typography>
        <Typography sx={s.metaLine}>{periodLabel}</Typography>
        <Typography sx={s.metaLine}>Generated {formatDate(now)}</Typography>
      </Box>
    </Box>
  )
}
