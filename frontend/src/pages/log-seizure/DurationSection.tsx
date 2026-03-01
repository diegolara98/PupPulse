import { Box, TextField, Chip } from '@mui/material'
import FormSection from '../../components/FormSection'
import { durationSectionStyles as s } from './DurationSection.styles'

interface Props {
  minutes: string
  seconds: string
  onChange: (field: 'durationMinutes' | 'durationSeconds', value: string) => void
}

export default function DurationSection({ minutes, seconds, onChange }: Props) {
  return (
    <FormSection title="How long did it last?">
      <Box sx={s.row}>
        <TextField
          label="Minutes" type="number" value={minutes} fullWidth
          onChange={e => onChange('durationMinutes', e.target.value)}
          slotProps={{ htmlInput: { min: 0 } }}
        />
        <TextField
          label="Seconds" type="number" value={seconds} fullWidth
          onChange={e => onChange('durationSeconds', e.target.value)}
          slotProps={{ htmlInput: { min: 0, max: 59 } }}
        />
      </Box>
      {Number(minutes) >= 5 && (
        <Chip
          label="⚠️ Over 5 minutes — seek emergency care if still seizing"
          color="error" sx={s.warningChip}
        />
      )}
    </FormSection>
  )
}
