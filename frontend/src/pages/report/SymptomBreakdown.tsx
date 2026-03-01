import { Box, Typography } from '@mui/material'
import type { SeizureRecord } from '../../types'
import { calcFrequencies } from './reportUtils'
import { symptomBreakdownStyles as s } from './SymptomBreakdown.styles'

interface Props {
  records: SeizureRecord[]
}

function FrequencyColumn({ title, items }: {
  title: string
  items: { label: string; pct: number }[]
}) {
  return (
    <Box>
      <Typography sx={s.columnTitle}>{title}</Typography>
      {items.length === 0
        ? <Typography sx={s.empty}>None recorded</Typography>
        : items.map(({ label, pct }) => (
          <Box key={label} sx={s.row}>
            <Typography sx={s.symptomLabel}>{label}</Typography>
            <Typography sx={s.pct}>{pct}%</Typography>
          </Box>
        ))
      }
    </Box>
  )
}

export default function SymptomBreakdown({ records }: Props) {
  return (
    <Box sx={s.grid}>
      <FrequencyColumn title="During Seizure" items={calcFrequencies(records, 'during_symptoms')} />
      <FrequencyColumn title="Warning Signs"  items={calcFrequencies(records, 'warning_signs')} />
      <FrequencyColumn title="Recovery"       items={calcFrequencies(records, 'recovery_symptoms')} />
      <FrequencyColumn title="Triggers"       items={calcFrequencies(records, 'triggers')} />
    </Box>
  )
}
