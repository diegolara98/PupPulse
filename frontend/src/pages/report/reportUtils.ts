import type { SeizureRecord } from '../../types'

export type TimeRange = '1M' | '3M' | '6M' | '1Y' | 'All'

export const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  '1M': 'Last Month',
  '3M': 'Last 3 Months',
  '6M': 'Last 6 Months',
  '1Y': 'Last Year',
  'All': 'All Time',
}

export interface ChartBucket {
  label: string
  count: number
}

// ─── Range filtering ──────────────────────────────────────────────────────────

export function getRangeStart(range: TimeRange): Date | null {
  if (range === 'All') return null
  const now = new Date()
  const months = { '1M': 1, '3M': 3, '6M': 6, '1Y': 12 }[range]
  return new Date(now.getFullYear(), now.getMonth() - months, now.getDate())
}

export function filterByRange(records: SeizureRecord[], range: TimeRange): SeizureRecord[] {
  const start = getRangeStart(range)
  if (!start) return records
  return records.filter(r => new Date(r.occurred_at) >= start)
}

// ─── Chart bucketing ──────────────────────────────────────────────────────────
// Bucket granularity scales with the selected range:
//   1M  → weekly (4 bars)
//   3M  → bi-weekly (6 bars)
//   6M  → monthly (6 bars)
//   1Y  → monthly (12 bars)
//   All → monthly (span of all data)

export function buildChartBuckets(records: SeizureRecord[], range: TimeRange): ChartBucket[] {
  const now = new Date()

  if (range === '1M') {
    return Array.from({ length: 4 }, (_, i) => {
      // Align buckets to Sunday boundaries, stepping back from the current week
      const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - (3 - i) * 7)
      const weekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 7)
      return {
        label: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: records.filter(r => { const d = new Date(r.occurred_at); return d >= weekStart && d < weekEnd }).length,
      }
    })
  }

  if (range === '3M') {
    return Array.from({ length: 6 }, (_, i) => {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (5 - i) * 14)
      const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 14)
      return {
        label: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: records.filter(r => { const d = new Date(r.occurred_at); return d >= start && d < end }).length,
      }
    })
  }

  // Monthly buckets for 6M / 1Y / All
  const monthCount = range === '6M' ? 6 : range === '1Y' ? 12 : calcMonthSpan(records)

  return Array.from({ length: monthCount }, (_, i) => {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - (monthCount - 1 - i), 1)
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1)
    // Include year in label when the span crosses multiple calendar years
    const label = monthCount > 13
      ? monthStart.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      : monthStart.toLocaleDateString('en-US', { month: 'short' })
    return {
      label,
      count: records.filter(r => { const d = new Date(r.occurred_at); return d >= monthStart && d < monthEnd }).length,
    }
  })
}

function calcMonthSpan(records: SeizureRecord[]): number {
  if (records.length === 0) return 1
  const oldest = new Date(records[records.length - 1].occurred_at)
  const now = new Date()
  return Math.max(1, (now.getFullYear() - oldest.getFullYear()) * 12 + (now.getMonth() - oldest.getMonth()) + 1)
}

// ─── Stat helpers ─────────────────────────────────────────────────────────────

/** Returns the most frequently occurring non-null value in an array. */
export function mostCommon(values: (string | null)[]): string {
  const counts = values
    .filter((v): v is string => v !== null && v !== '')
    .reduce<Record<string, number>>((acc, v) => ({ ...acc, [v]: (acc[v] ?? 0) + 1 }), {})
  const top = Object.entries(counts).sort(([, a], [, b]) => b - a)[0]
  return top?.[0] ?? '—'
}

/** Calculates what % of seizures included each value in a multi-select field. Returns top 5. */
export function calcFrequencies(
  records: SeizureRecord[],
  field: 'during_symptoms' | 'warning_signs' | 'recovery_symptoms' | 'triggers',
): { label: string; pct: number }[] {
  if (records.length === 0) return []
  const counts: Record<string, number> = {}
  records.forEach(r => {
    ;(r[field] as string[]).forEach(val => { counts[val] = (counts[val] ?? 0) + 1 })
  })
  return Object.entries(counts)
    .map(([label, count]) => ({ label, pct: Math.round((count / records.length) * 100) }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5)
}

/** Calculates a dog's age from a YYYY-MM-DD date string. */
export function calcDogAge(dob: string | null): string {
  if (!dob) return '—'
  const birth = new Date(dob)
  const now = new Date()
  const years = now.getFullYear() - birth.getFullYear()
  const months = now.getMonth() - birth.getMonth()
  const y = months < 0 ? years - 1 : years
  const m = months < 0 ? months + 12 : months
  if (y === 0) return `${m}mo`
  if (m === 0) return `${y}y`
  return `${y}y ${m}mo`
}
