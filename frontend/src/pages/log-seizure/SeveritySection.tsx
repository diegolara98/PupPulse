import { ToggleButtonGroup, ToggleButton } from '@mui/material'
import FormSection from '../../components/FormSection'
import { SEVERITY_COLORS } from '../../lib/seizureUtils'
import { severitySectionStyles as s } from './SeveritySection.styles'

interface Props {
  value: string
  onChange: (value: string) => void
}

export default function SeveritySection({ value, onChange }: Props) {
  return (
    <FormSection title="How severe was it?">
      <ToggleButtonGroup
        value={value} exclusive sx={s.toggleGroup}
        onChange={(_, val) => val && onChange(val)}
      >
        {Object.entries(SEVERITY_COLORS).map(([label, color]) => (
          <ToggleButton key={label} value={label} sx={s.severityButton(color)}>
            {label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </FormSection>
  )
}
