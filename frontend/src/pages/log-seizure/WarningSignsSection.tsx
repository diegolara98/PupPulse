import FormSection from '../../components/FormSection'
import CheckboxGroup from './CheckboxGroup'
import { WARNING_SIGNS } from './logSeizureShared'

interface Props {
  checked: string[]
  onToggle: (opt: string) => void
}

export default function WarningSignsSection({ checked, onToggle }: Props) {
  return (
    <FormSection title="Any warning signs beforehand?">
      <CheckboxGroup
        options={WARNING_SIGNS}
        checked={opt => checked.includes(opt)}
        onChange={onToggle}
      />
    </FormSection>
  )
}
