import { TextField } from '@mui/material'
import FormSection from '../../components/FormSection'
import YesNoRadio from './YesNoRadio'
import { clusterSectionStyles as s } from './ClusterSection.styles'

interface Props {
  isCluster: string
  clusterCount: string
  onChange: (field: 'isCluster' | 'clusterCount', value: string) => void
}

export default function ClusterSection({ isCluster, clusterCount, onChange }: Props) {
  return (
    <FormSection title="Was this part of a cluster?">
      <YesNoRadio value={isCluster} onChange={val => onChange('isCluster', val)} />
      {isCluster === 'yes' && (
        <TextField
          label="How many seizures in the last 24 hours?" type="number"
          value={clusterCount} fullWidth sx={s.countField}
          onChange={e => onChange('clusterCount', e.target.value)}
          slotProps={{ htmlInput: { min: 2 } }}
        />
      )}
    </FormSection>
  )
}
