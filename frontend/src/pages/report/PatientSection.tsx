import { Box, Typography } from '@mui/material'
import type { Profile } from '../../types'
import { calcDogAge } from './reportUtils'
import { patientSectionStyles as s } from './PatientSection.styles'

interface Props {
  profile: Profile | null
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <Box sx={s.field}>
      <Typography component="span" sx={s.label}>{label}</Typography>
      <Typography sx={s.value}>{value ?? '—'}</Typography>
    </Box>
  )
}

export default function PatientSection({ profile }: Props) {
  if (!profile) {
    return <Typography sx={s.noProfile}>Profile not set up — visit the Profile page to add dog and vet details.</Typography>
  }

  const dob = profile.dog_dob
    ? new Date(profile.dog_dob).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  return (
    <Box sx={s.grid}>
      <Box>
        <Field label="Name" value={profile.dog_name} />
        <Field label="Breed" value={profile.dog_breed} />
        <Field label="Date of Birth" value={dob ? `${dob} (${calcDogAge(profile.dog_dob)})` : null} />
      </Box>
      <Box>
        <Field label="Veterinarian" value={profile.vet_name} />
        <Field label="Vet Phone" value={profile.vet_phone} />
        <Field label="Current Medications" value={profile.medications} />
      </Box>
    </Box>
  )
}
