import { ToggleButtonGroup, ToggleButton } from '@mui/material'
import FormSection from '../../components/FormSection'
import { SEIZURE_TYPES } from './logSeizureShared'
import { typeSectionStyles as s } from './TypeSection.styles'

interface Props {
  value: string
  onChange: (value: string) => void
}

export default function TypeSection({ value, onChange }: Props) {
  return (
    <FormSection title="What type of seizure was it?">
      <ToggleButtonGroup
        value={value} exclusive sx={s.toggleGroup}
        onChange={(_, val) => val && onChange(val)}
      >
        {SEIZURE_TYPES.map(t => (
          <ToggleButton key={t} value={t} sx={s.toggleButton}>{t}</ToggleButton>
        ))}
      </ToggleButtonGroup>
    </FormSection>
  )
}
