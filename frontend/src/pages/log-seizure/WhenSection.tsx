import { Box, TextField } from '@mui/material'
import FormSection from '../../components/FormSection'
import { whenSectionStyles as s } from './WhenSection.styles'

interface Props {
  date: string
  time: string
  onChange: (field: 'date' | 'time', value: string) => void
}

export default function WhenSection({ date, time, onChange }: Props) {
  return (
    <FormSection title="When did it happen?">
      <Box sx={s.row}>
        <TextField
          label="Date" type="date" value={date} fullWidth
          onChange={e => onChange('date', e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          helperText="Defaults to when you opened this form"
        />
        <TextField
          label="Time" type="time" value={time} fullWidth
          onChange={e => onChange('time', e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          helperText="Defaults to when you opened this form"
        />
      </Box>
    </FormSection>
  )
}
