import FormSection from '../../components/FormSection'
import CheckboxGroup from './CheckboxGroup'
import { TRIGGERS } from './logSeizureShared'

interface Props {
  checked: string[]
  onToggle: (opt: string) => void
}

export default function TriggersSection({ checked, onToggle }: Props) {
  return (
    <FormSection title="Any possible triggers?">
      <CheckboxGroup
        options={TRIGGERS}
        checked={opt => checked.includes(opt)}
        onChange={onToggle}
      />
    </FormSection>
  )
}
