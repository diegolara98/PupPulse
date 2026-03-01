import { useState } from 'react'
import {
  Box, Typography, TextField, ToggleButtonGroup, ToggleButton,
  FormGroup, FormControlLabel, Checkbox, Radio, RadioGroup,
  FormControl, Button, Chip, Alert, CircularProgress,
} from '@mui/material'
import { supabase } from '../lib/supabase'
import { SEVERITY_COLORS } from '../lib/seizureUtils'
import FormSection from '../components/FormSection'
import { logSeizureStyles as s } from './LogSeizure.styles'

// ─── Static option lists ─────────────────────────────────────────────────────
// Kept at module level so they're never recreated on re-render.

const SEIZURE_TYPES = ['Grand Mal', 'Focal', 'Absence', 'Unknown'] as const

const DURING_SYMPTOMS = [
  'Convulsions', 'Paddling', 'Stiffening', 'Jaw chomping',
  'Loss of bladder / bowel', 'Vocalizing', 'Unconscious',
] as const

const WARNING_SIGNS = ['Pacing', 'Whining', 'Hiding', 'Clinginess', 'Restlessness', 'None'] as const

const RECOVERY_SYMPTOMS = [
  'Disorientation', 'Lethargy', 'Hunger / thirst', 'Temporary blindness',
] as const

const TRIGGERS = [
  'Missed medication', 'Stress', 'Diet change',
  'Storm / weather', 'Excitement', 'Unknown',
] as const

// ─── Private sub-components ───────────────────────────────────────────────────
// Defined at module level (not inside the component body) so React's reconciler
// treats them as stable components and never unmounts/remounts them on re-render.

function CheckboxGroup({ options, checked, onChange }: {
  options: readonly string[]
  checked: (opt: string) => boolean
  onChange: (opt: string) => void
}) {
  return (
    <FormGroup sx={s.checkboxGrid}>
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

function YesNoRadio({ value, onChange }: {
  value: string
  onChange: (val: string) => void
}) {
  return (
    <FormControl>
      <RadioGroup row value={value} onChange={e => onChange(e.target.value)}>
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
      </RadioGroup>
    </FormControl>
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface LogSeizureProps {
  startedAt: Date
  userId: string
}

interface FormState {
  date: string
  time: string
  durationMinutes: string
  durationSeconds: string
  seizureType: string
  severity: string
  duringSymptoms: string[]
  warningSigns: string[]
  recoveryDuration: string
  recoverySymptoms: string[]
  isCluster: string
  clusterCount: string
  emergencyMeds: string
  emergencyMedName: string
  emergencyMedTime: string
  triggers: string[]
  notes: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const padTwo = (n: number) => n.toString().padStart(2, '0')
const toDateInput = (d: Date) =>
  `${d.getFullYear()}-${padTwo(d.getMonth() + 1)}-${padTwo(d.getDate())}`
const toTimeInput = (d: Date) =>
  `${padTwo(d.getHours())}:${padTwo(d.getMinutes())}`

// ─── Component ────────────────────────────────────────────────────────────────

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

      <FormSection title="When did it happen?">
        <Box sx={s.dateTimeRow}>
          <TextField
            label="Date" type="date" value={form.date} fullWidth
            onChange={e => set('date', e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            helperText="Defaults to when you opened this form"
          />
          <TextField
            label="Time" type="time" value={form.time} fullWidth
            onChange={e => set('time', e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            helperText="Defaults to when you opened this form"
          />
        </Box>
      </FormSection>

      <FormSection title="How long did it last?">
        <Box sx={s.durationRow}>
          <TextField
            label="Minutes" type="number" value={form.durationMinutes} fullWidth
            onChange={e => set('durationMinutes', e.target.value)}
            slotProps={{ htmlInput: { min: 0 } }}
          />
          <TextField
            label="Seconds" type="number" value={form.durationSeconds} fullWidth
            onChange={e => set('durationSeconds', e.target.value)}
            slotProps={{ htmlInput: { min: 0, max: 59 } }}
          />
        </Box>
        {Number(form.durationMinutes) >= 5 && (
          <Chip
            label="⚠️ Over 5 minutes — seek emergency care if still seizing"
            color="error" sx={s.warningChip}
          />
        )}
      </FormSection>

      <FormSection title="What type of seizure was it?">
        <ToggleButtonGroup
          value={form.seizureType} exclusive sx={s.toggleGroup}
          onChange={(_, val) => val && set('seizureType', val)}
        >
          {SEIZURE_TYPES.map(t => (
            <ToggleButton key={t} value={t} sx={s.toggleButton}>{t}</ToggleButton>
          ))}
        </ToggleButtonGroup>
      </FormSection>

      <FormSection title="How severe was it?">
        <ToggleButtonGroup
          value={form.severity} exclusive sx={s.toggleGroup}
          onChange={(_, val) => val && set('severity', val)}
        >
          {Object.entries(SEVERITY_COLORS).map(([label, color]) => (
            <ToggleButton key={label} value={label} sx={s.severityButton(color)}>
              {label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </FormSection>

      <FormSection title="What happened during the seizure?">
        <CheckboxGroup
          options={DURING_SYMPTOMS}
          checked={opt => form.duringSymptoms.includes(opt)}
          onChange={opt => toggleCheck('duringSymptoms', opt)}
        />
      </FormSection>

      <FormSection title="Any warning signs beforehand?">
        <CheckboxGroup
          options={WARNING_SIGNS}
          checked={opt => form.warningSigns.includes(opt)}
          onChange={opt => toggleCheck('warningSigns', opt)}
        />
      </FormSection>

      <FormSection title="How was recovery?">
        <TextField
          label="Recovery duration (minutes)" type="number"
          value={form.recoveryDuration} fullWidth sx={s.recoveryField}
          onChange={e => set('recoveryDuration', e.target.value)}
          slotProps={{ htmlInput: { min: 0 } }}
        />
        <CheckboxGroup
          options={RECOVERY_SYMPTOMS}
          checked={opt => form.recoverySymptoms.includes(opt)}
          onChange={opt => toggleCheck('recoverySymptoms', opt)}
        />
      </FormSection>

      <FormSection title="Was this part of a cluster?">
        <YesNoRadio value={form.isCluster} onChange={val => set('isCluster', val)} />
        {form.isCluster === 'yes' && (
          <TextField
            label="How many seizures in the last 24 hours?" type="number"
            value={form.clusterCount} fullWidth sx={s.conditionalField}
            onChange={e => set('clusterCount', e.target.value)}
            slotProps={{ htmlInput: { min: 2 } }}
          />
        )}
      </FormSection>

      <FormSection title="Were emergency meds given?">
        <YesNoRadio value={form.emergencyMeds} onChange={val => set('emergencyMeds', val)} />
        {form.emergencyMeds === 'yes' && (
          <Box sx={s.medRow}>
            <TextField
              label="Medication name" value={form.emergencyMedName} fullWidth
              onChange={e => set('emergencyMedName', e.target.value)}
            />
            <TextField
              label="Time given" type="time" value={form.emergencyMedTime} fullWidth
              onChange={e => set('emergencyMedTime', e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>
        )}
      </FormSection>

      <FormSection title="Any possible triggers?">
        <CheckboxGroup
          options={TRIGGERS}
          checked={opt => form.triggers.includes(opt)}
          onChange={opt => toggleCheck('triggers', opt)}
        />
      </FormSection>

      <FormSection title="Additional notes">
        <TextField
          label="Anything else to add?" multiline rows={4}
          value={form.notes} fullWidth
          onChange={e => set('notes', e.target.value)}
        />
      </FormSection>

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
