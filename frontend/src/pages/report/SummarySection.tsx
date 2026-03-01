import { Box, Typography } from '@mui/material'
import type { SeizureRecord } from '../../types'
import { calcAvgPerMonth, formatRelativeDate } from '../../lib/seizureUtils'
import { mostCommon } from './reportUtils'
import { summarySectionStyles as s } from './SummarySection.styles'

interface Props {
  records: SeizureRecord[]
}

function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <Box sx={s.card}>
      <Typography sx={s.value}>{value}</Typography>
      <Typography sx={s.label}>{label}</Typography>
    </Box>
  )
}

export default function SummarySection({ records }: Props) {
  const last = records[0] ? formatRelativeDate(records[0].occurred_at) : '—'
  const avg = calcAvgPerMonth(records)
  const commonType = mostCommon(records.map(r => r.seizure_type))
  const commonSeverity = mostCommon(records.map(r => r.severity))

  return (
    <Box sx={s.grid}>
      <StatCard value={records.length || '—'} label="Total Seizures" />
      <StatCard value={last} label="Last Seizure" />
      <StatCard value={avg} label="Avg / Month" />
      <StatCard value={commonType} label="Common Type" />
      <StatCard value={commonSeverity} label="Common Severity" />
    </Box>
  )
}
