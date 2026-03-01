import { TextField } from '@mui/material'
import FormSection from '../../components/FormSection'
import CheckboxGroup from './CheckboxGroup'
import { RECOVERY_SYMPTOMS } from './logSeizureShared'
import { recoverySectionStyles as s } from './RecoverySection.styles'

interface Props {
  duration: string
  symptoms: string[]
  onDurationChange: (value: string) => void
  onSymptomToggle: (opt: string) => void
}

export default function RecoverySection({ duration, symptoms, onDurationChange, onSymptomToggle }: Props) {
  return (
    <FormSection title="How was recovery?">
      <TextField
        label="Recovery duration (minutes)" type="number"
        value={duration} fullWidth sx={s.durationField}
        onChange={e => onDurationChange(e.target.value)}
        slotProps={{ htmlInput: { min: 0 } }}
      />
      <CheckboxGroup
        options={RECOVERY_SYMPTOMS}
        checked={opt => symptoms.includes(opt)}
        onChange={onSymptomToggle}
      />
    </FormSection>
  )
}
