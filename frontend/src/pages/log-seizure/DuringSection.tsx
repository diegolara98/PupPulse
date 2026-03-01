import FormSection from '../../components/FormSection'
import CheckboxGroup from './CheckboxGroup'
import { DURING_SYMPTOMS } from './logSeizureShared'

interface Props {
  checked: string[]
  onToggle: (opt: string) => void
}

export default function DuringSection({ checked, onToggle }: Props) {
  return (
    <FormSection title="What happened during the seizure?">
      <CheckboxGroup
        options={DURING_SYMPTOMS}
        checked={opt => checked.includes(opt)}
        onChange={onToggle}
      />
    </FormSection>
  )
}
