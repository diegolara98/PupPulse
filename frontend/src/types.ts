export type Page = 'dashboard' | 'log' | 'history' | 'reports' | 'profile'

export interface Profile {
  id: string
  dog_name: string | null
  dog_breed: string | null
  dog_dob: string | null
  medications: string | null
  vet_name: string | null
  vet_phone: string | null
}

/**
 * Shape of a row returned from the `seizures` table.
 * Shared between History (full row) and Dashboard (partial select via Pick).
 */
export interface SeizureRecord {
  id: string
  occurred_at: string
  duration_seconds: number | null
  seizure_type: string | null
  severity: string | null
  during_symptoms: string[]
  warning_signs: string[]
  recovery_duration_minutes: number | null
  recovery_symptoms: string[]
  is_cluster: boolean | null
  cluster_count: number | null
  emergency_meds_given: boolean | null
  emergency_med_name: string | null
  emergency_med_time: string | null
  triggers: string[]
  notes: string | null
}
