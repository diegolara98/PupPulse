import { useState, useEffect } from 'react'
import {
  Box, Typography, TextField, Button, Alert, CircularProgress,
} from '@mui/material'
import { supabase } from '../lib/supabase'
import FormSection from '../components/FormSection'
import { profileStyles as s } from './Profile.styles'

interface ProfileProps {
  userId: string
}

interface ProfileForm {
  dogName: string
  dogBreed: string
  dogDob: string
  medications: string
  vetName: string
  vetPhone: string
}

export default function Profile({ userId }: ProfileProps) {
  const [form, setForm] = useState<ProfileForm>({
    dogName: '',
    dogBreed: '',
    dogDob: '',
    medications: '',
    vetName: '',
    vetPhone: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
      .then(({ data, error }) => {
        setLoading(false)
        if (error) setError(error.message)
        else if (data) {
          setForm({
            dogName: data.dog_name ?? '',
            dogBreed: data.dog_breed ?? '',
            dogDob: data.dog_dob ?? '',
            medications: data.medications ?? '',
            vetName: data.vet_name ?? '',
            vetPhone: data.vet_phone ?? '',
          })
        }
      })
  }, [userId])

  const set = (field: keyof ProfileForm, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)

    const { error } = await supabase
      .from('profiles')
      .update({
        dog_name: form.dogName || null,
        dog_breed: form.dogBreed || null,
        dog_dob: form.dogDob || null,
        medications: form.medications || null,
        vet_name: form.vetName || null,
        vet_phone: form.vetPhone || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    setSaving(false)
    if (error) setError(error.message)
    else setSuccess(true)
  }

  if (loading) {
    return <Box sx={s.centered}><CircularProgress /></Box>
  }

  return (
    <Box sx={s.wrapper}>
      <Typography variant="h5" sx={s.pageTitle}>Profile</Typography>

      <FormSection title="Dog Information">
        <Box sx={s.twoCol}>
          <TextField
            label="Dog's name" value={form.dogName} fullWidth
            onChange={e => set('dogName', e.target.value)}
          />
          <TextField
            label="Breed" value={form.dogBreed} fullWidth
            onChange={e => set('dogBreed', e.target.value)}
          />
        </Box>
        <TextField
          label="Date of birth" type="date" value={form.dogDob} fullWidth
          onChange={e => set('dogDob', e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={s.dobField}
        />
      </FormSection>

      <FormSection title="Current Medications">
        <TextField
          label="Medications, doses, and frequency"
          multiline rows={3} value={form.medications} fullWidth
          onChange={e => set('medications', e.target.value)}
          helperText="e.g. Phenobarbital 32.5mg twice daily, KBr 500mg once daily"
        />
      </FormSection>

      <FormSection title="Veterinarian">
        <Box sx={s.twoCol}>
          <TextField
            label="Vet's name" value={form.vetName} fullWidth
            onChange={e => set('vetName', e.target.value)}
          />
          <TextField
            label="Phone number" value={form.vetPhone} fullWidth
            onChange={e => set('vetPhone', e.target.value)}
          />
        </Box>
      </FormSection>

      {error && <Alert severity="error" sx={s.alert}>{error}</Alert>}
      {success && <Alert severity="success" sx={s.alert}>Profile saved.</Alert>}

      <Box sx={s.submitRow}>
        <Button
          variant="contained" size="large" sx={s.submitButton}
          onClick={handleSave} disabled={saving}
          startIcon={saving ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </Box>
    </Box>
  )
}
