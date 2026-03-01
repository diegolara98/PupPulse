/**
 * Shared formatting and calculation utilities for seizure data.
 * Centralised here so Dashboard, History, and LogSeizure all read from
 * the same source — change a label or colour once, it updates everywhere.
 */

/** Canonical severity → colour mapping used by every view that colours by severity. */
export const SEVERITY_COLORS: Record<string, string> = {
  Mild: '#388e3c',
  Moderate: '#f57c00',
  Severe: '#d32f2f',
}

/** Converts a total-seconds value to a compact human-readable string, e.g. "1m 30s". */
export function formatDuration(seconds: number | null): string {
  if (!seconds) return '—'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s}s`
  if (s === 0) return `${m}m`
  return `${m}m ${s}s`
}

/** Short date label, e.g. "Feb 20, 2025". */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

/** Clock time label, e.g. "2:14 AM". */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit',
  })
}

/**
 * Returns a recency label rather than an absolute date.
 * Used on the dashboard where "3 days ago" is more scannable than "Feb 21, 2026".
 * Falls back to a short date once the gap exceeds a month.
 */
export function formatRelativeDate(iso: string): string {
  const diffDays = Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/**
 * Calculates average seizures per calendar month since the earliest record.
 *
 * The +1 on the month span prevents division by zero when all records fall
 * within the current calendar month (0 elapsed months → 1 effective month).
 *
 * Accepts any array of objects with occurred_at so it works whether the caller
 * has full SeizureRecord rows or a lightweight summary projection.
 */
export function calcAvgPerMonth(records: { occurred_at: string }[]): string {
  if (records.length === 0) return '—'
  if (records.length === 1) return '1 / mo'

  const oldest = new Date(records[records.length - 1].occurred_at)
  const now = new Date()
  const months =
    (now.getFullYear() - oldest.getFullYear()) * 12 +
    (now.getMonth() - oldest.getMonth()) + 1

  const avg = records.length / months
  return `${avg % 1 === 0 ? avg : avg.toFixed(1)} / mo`
}
