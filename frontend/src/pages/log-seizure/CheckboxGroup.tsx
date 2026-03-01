import { FormGroup, FormControlLabel, Checkbox } from '@mui/material'

// Inline — no separate styles file needed for a two-property grid
const sx = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 0.5,
}

interface Props {
  options: readonly string[]
  checked: (opt: string) => boolean
  onChange: (opt: string) => void
}

export default function CheckboxGroup({ options, checked, onChange }: Props) {
  return (
    <FormGroup sx={sx}>
      {options.map(opt => (
        <FormControlLabel
          key={opt}
          label={opt}
          control={
            <Checkbox size="small" checked={checked(opt)} onChange={() => onChange(opt)} />
          }
        />
      ))}
    </FormGroup>
  )
}
