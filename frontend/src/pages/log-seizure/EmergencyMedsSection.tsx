import { Box, TextField } from '@mui/material'
import FormSection from '../../components/FormSection'
import YesNoRadio from './YesNoRadio'
import { emergencyMedsSectionStyles as s } from './EmergencyMedsSection.styles'

interface Props {
  emergencyMeds: string
  medName: string
  medTime: string
  onChange: (field: 'emergencyMeds' | 'emergencyMedName' | 'emergencyMedTime', value: string) => void
}

export default function EmergencyMedsSection({ emergencyMeds, medName, medTime, onChange }: Props) {
  return (
    <FormSection title="Were emergency meds given?">
      <YesNoRadio value={emergencyMeds} onChange={val => onChange('emergencyMeds', val)} />
      {emergencyMeds === 'yes' && (
        <Box sx={s.fieldsRow}>
          <TextField
            label="Medication name" value={medName} fullWidth
            onChange={e => onChange('emergencyMedName', e.target.value)}
          />
          <TextField
            label="Time given" type="time" value={medTime} fullWidth
            onChange={e => onChange('emergencyMedTime', e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Box>
      )}
    </FormSection>
  )
}
