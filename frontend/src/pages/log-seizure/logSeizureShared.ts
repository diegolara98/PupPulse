/**
 * Shared types, constants, and helpers for the Log Seizure form.
 * Sections import what they need from here rather than defining their own.
 */

export interface FormState {
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

// Formats a Date into the YYYY-MM-DD string required by <input type="date">
const padTwo = (n: number) => n.toString().padStart(2, '0')
export const toDateInput = (d: Date) =>
  `${d.getFullYear()}-${padTwo(d.getMonth() + 1)}-${padTwo(d.getDate())}`

// Formats a Date into the HH:MM string required by <input type="time">
export const toTimeInput = (d: Date) =>
  `${padTwo(d.getHours())}:${padTwo(d.getMinutes())}`

// Option arrays — defined once here so every section imports from the same place
export const SEIZURE_TYPES = ['Grand Mal', 'Focal', 'Absence', 'Unknown'] as const

export const DURING_SYMPTOMS = [
  'Convulsions', 'Paddling', 'Stiffening', 'Jaw chomping',
  'Loss of bladder / bowel', 'Vocalizing', 'Unconscious',
] as const

export const WARNING_SIGNS = [
  'Pacing', 'Whining', 'Hiding', 'Clinginess', 'Restlessness', 'None',
] as const

export const RECOVERY_SYMPTOMS = [
  'Disorientation', 'Lethargy', 'Hunger / thirst', 'Temporary blindness',
] as const

export const TRIGGERS = [
  'Missed medication', 'Stress', 'Diet change',
  'Storm / weather', 'Excitement', 'Unknown',
] as const
