import { FormControl, FormControlLabel, RadioGroup, Radio } from '@mui/material'

interface Props {
  value: string
  onChange: (val: string) => void
}

export default function YesNoRadio({ value, onChange }: Props) {
  return (
    <FormControl>
      <RadioGroup row value={value} onChange={e => onChange(e.target.value)}>
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
      </RadioGroup>
    </FormControl>
  )
}
