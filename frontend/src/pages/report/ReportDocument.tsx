import { forwardRef } from 'react'
import { Box, Typography } from '@mui/material'
import type { SeizureRecord, Profile } from '../../types'
import type { TimeRange } from './reportUtils'
import { filterByRange } from './reportUtils'
import ReportHeader from './ReportHeader'
import PatientSection from './PatientSection'
import SummarySection from './SummarySection'
import FrequencyChart from './FrequencyChart'
import SeizureLogTable from './SeizureLogTable'
import SymptomBreakdown from './SymptomBreakdown'
import NotableEvents from './NotableEvents'
import { reportDocumentStyles as s } from './ReportDocument.styles'

interface Props {
  records: SeizureRecord[]
  profile: Profile | null
  range: TimeRange
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={s.sectionCard}>
      <Typography sx={s.sectionTitle}>{title}</Typography>
      {children}
    </Box>
  )
}

// forwardRef so the parent (Reports.tsx) can pass a ref for html2canvas to capture
const ReportDocument = forwardRef<HTMLDivElement, Props>(({ records, profile, range }, ref) => {
  // All sections work from the range-filtered slice except the chart,
  // which receives the full set and handles its own bucketing internally
  const filtered = filterByRange(records, range)

  return (
    <Box ref={ref} sx={s.root}>
      <ReportHeader range={range} />

      <Section title="Patient">
        <PatientSection profile={profile} />
      </Section>

      <Section title="Summary">
        <SummarySection records={filtered} />
      </Section>

      <Section title="Seizure Frequency">
        <FrequencyChart records={records} range={range} />
      </Section>

      <Section title="Seizure Log">
        <SeizureLogTable records={filtered} />
      </Section>

      <Section title="Symptom Breakdown">
        <SymptomBreakdown records={filtered} />
      </Section>

      <Section title="Notable Events">
        <NotableEvents records={filtered} />
      </Section>
    </Box>
  )
})

ReportDocument.displayName = 'ReportDocument'

export default ReportDocument
