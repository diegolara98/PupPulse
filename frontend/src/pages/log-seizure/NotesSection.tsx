import { TextField } from '@mui/material'
import FormSection from '../../components/FormSection'

interface Props {
  value: string
  onChange: (value: string) => void
}

export default function NotesSection({ value, onChange }: Props) {
  return (
    <FormSection title="Additional notes">
      <TextField
        label="Anything else to add?" multiline rows={4}
        value={value} fullWidth
        onChange={e => onChange(e.target.value)}
      />
    </FormSection>
  )
}
