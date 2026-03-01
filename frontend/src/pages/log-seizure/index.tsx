import { useState } from 'react'
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material'
import { supabase } from '../../lib/supabase'
import { type FormState, toDateInput, toTimeInput } from './logSeizureShared'
import WhenSection from './WhenSection'
import DurationSection from './DurationSection'
import TypeSection from './TypeSection'
import SeveritySection from './SeveritySection'
import DuringSection from './DuringSection'
import WarningSignsSection from './WarningSignsSection'
import RecoverySection from './RecoverySection'
import ClusterSection from './ClusterSection'
import EmergencyMedsSection from './EmergencyMedsSection'
import TriggersSection from './TriggersSection'
import NotesSection from './NotesSection'
import { logSeizureStyles as s } from './index.styles'

interface LogSeizureProps {
  startedAt: Date
  userId: string
}

export default function LogSeizure({ startedAt, userId }: LogSeizureProps) {
  const [form, setForm] = useState<FormState>({
    date: toDateInput(startedAt),
    time: toTimeInput(startedAt),
    durationMinutes: '',
    durationSeconds: '',
    seizureType: '',
    severity: '',
    duringSymptoms: [],
    warningSigns: [],
    recoveryDuration: '',
    recoverySymptoms: [],
    isCluster: '',
    clusterCount: '',
    emergencyMeds: '',
    emergencyMedName: '',
    emergencyMedTime: '',
    triggers: [],
    notes: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Generic single-field setter — avoids a separate onChange handler per text field
  const set = (field: keyof FormState, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  // Toggles an item in/out of a checkbox array field
  const toggleCheck = (
    field: 'duringSymptoms' | 'warningSigns' | 'recoverySymptoms' | 'triggers',
    value: string,
  ) =>
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }))

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    const occurredAt = new Date(`${form.date}T${form.time}`)

    // `|| null` converts a 0 result (both fields empty) to null so we don't
    // store a zero-second duration when the user skipped the field
    const durationSeconds =
      (Number(form.durationMinutes) * 60) + Number(form.durationSeconds) || null

    const { error } = await supabase.from('seizures').insert({
      user_id: userId,
      occurred_at: occurredAt.toISOString(),
      duration_seconds: durationSeconds,
      seizure_type: form.seizureType || null,
      severity: form.severity || null,
      during_symptoms: form.duringSymptoms,
      warning_signs: form.warningSigns,
      recovery_duration_minutes: Number(form.recoveryDuration) || null,
      recovery_symptoms: form.recoverySymptoms,
      // Radio values are stored as "yes"/"no" strings; convert to boolean for the DB
      is_cluster: form.isCluster === 'yes',
      cluster_count: form.isCluster === 'yes' ? Number(form.clusterCount) || null : null,
      emergency_meds_given: form.emergencyMeds === 'yes',
      emergency_med_name: form.emergencyMeds === 'yes' ? form.emergencyMedName || null : null,
      // Combine the seizure date with the separate med-time input into one timestamp
      emergency_med_time: form.emergencyMeds === 'yes' && form.emergencyMedTime
        ? new Date(`${form.date}T${form.emergencyMedTime}`).toISOString()
        : null,
      triggers: form.triggers,
      notes: form.notes || null,
    })

    setSubmitting(false)
    if (error) setSubmitError(error.message)
    else setSubmitSuccess(true)
  }

  return (
    <Box sx={s.wrapper}>
      <Typography variant="h5" sx={s.pageTitle}>Log a Seizure</Typography>

      <WhenSection
        date={form.date}
        time={form.time}
        onChange={(field, value) => set(field, value)}
      />
      <DurationSection
        minutes={form.durationMinutes}
        seconds={form.durationSeconds}
        onChange={(field, value) => set(field, value)}
      />
      <TypeSection
        value={form.seizureType}
        onChange={val => set('seizureType', val)}
      />
      <SeveritySection
        value={form.severity}
        onChange={val => set('severity', val)}
      />
      <DuringSection
        checked={form.duringSymptoms}
        onToggle={opt => toggleCheck('duringSymptoms', opt)}
      />
      <WarningSignsSection
        checked={form.warningSigns}
        onToggle={opt => toggleCheck('warningSigns', opt)}
      />
      <RecoverySection
        duration={form.recoveryDuration}
        symptoms={form.recoverySymptoms}
        onDurationChange={val => set('recoveryDuration', val)}
        onSymptomToggle={opt => toggleCheck('recoverySymptoms', opt)}
      />
      <ClusterSection
        isCluster={form.isCluster}
        clusterCount={form.clusterCount}
        onChange={(field, value) => set(field, value)}
      />
      <EmergencyMedsSection
        emergencyMeds={form.emergencyMeds}
        medName={form.emergencyMedName}
        medTime={form.emergencyMedTime}
        onChange={(field, value) => set(field, value)}
      />
      <TriggersSection
        checked={form.triggers}
        onToggle={opt => toggleCheck('triggers', opt)}
      />
      <NotesSection
        value={form.notes}
        onChange={val => set('notes', val)}
      />

      {submitError && (
        <Alert severity="error" sx={s.alerts}>{submitError}</Alert>
      )}
      {submitSuccess && (
        <Alert severity="success" sx={s.alerts}>Seizure log saved successfully.</Alert>
      )}

      <Box sx={s.submitRow}>
        <Button
          variant="contained" size="large" sx={s.submitButton}
          onClick={handleSubmit} disabled={submitting}
          startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {submitting ? 'Saving...' : 'Save Seizure Log'}
        </Button>
      </Box>
    </Box>
  )
}
