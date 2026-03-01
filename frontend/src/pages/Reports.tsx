import { useState, useEffect, useRef } from 'react'
import {
  Box, Typography, ToggleButtonGroup, ToggleButton,
  Button, CircularProgress, Alert,
} from '@mui/material'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { supabase } from '../lib/supabase'
import type { SeizureRecord, Profile } from '../types'
import type { TimeRange } from './report/reportUtils'
import { TIME_RANGE_LABELS } from './report/reportUtils'
import ReportDocument from './report/ReportDocument'
import { reportsStyles as s } from './Reports.styles'

interface ReportsProps {
  userId: string
}

type EmailStatus = 'idle' | 'sending' | 'sent' | 'error'

const RANGES: TimeRange[] = ['1M', '3M', '6M', '1Y', 'All']

export default function Reports({ userId }: ReportsProps) {
  const [records, setRecords] = useState<SeizureRecord[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [range, setRange] = useState<TimeRange>('1M')
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [emailStatus, setEmailStatus] = useState<EmailStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const reportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    Promise.all([
      supabase
        .from('seizures')
        .select('*')
        .eq('user_id', userId)
        .order('occurred_at', { ascending: false }),
      supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single(),
    ]).then(([seizuresResult, profileResult]) => {
      setLoading(false)
      if (seizuresResult.error) setError(seizuresResult.error.message)
      else setRecords(seizuresResult.data ?? [])
      if (!profileResult.error) setProfile(profileResult.data)
    })
  }, [userId])

  const handleExport = async () => {
    if (!reportRef.current) return
    setExporting(true)
    setEmailStatus('idle')
    setError(null)

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0f0f17',
        windowWidth: reportRef.current.scrollWidth,
        scrollY: -window.scrollY,
      })

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' })
      const pageWidth  = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgHeight  = (canvas.height * pageWidth) / canvas.width
      const imgData    = canvas.toDataURL('image/png')

      // Slice the captured canvas across multiple PDF pages
      let heightLeft = imgHeight
      let position   = 0
      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight)
      heightLeft -= pageHeight
      while (heightLeft > 0) {
        position -= pageHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight)
        heightLeft -= pageHeight
      }

      const dogName = profile?.dog_name ?? 'report'
      // output('base64') is unreliable in some jsPDF builds; datauristring is always populated
      const pdfBase64 = pdf.output('datauristring').split(',')[1]

      // Trigger browser download
      pdf.save(`PupPulse-${dogName}-${new Date().toISOString().slice(0, 10)}.pdf`)

      // Email the same PDF to the user's account address
      setEmailStatus('sending')
      const { error: fnError } = await supabase.functions.invoke('email-report', {
        body: {
          pdfBase64,
          dogName: profile?.dog_name ?? null,
          rangeLabel: TIME_RANGE_LABELS[range],
        },
      })

      setEmailStatus(fnError ? 'error' : 'sent')
    } catch (err) {
      setError('Export failed — please try again.')
      console.error(err)
    } finally {
      setExporting(false)
    }
  }

  return (
    <Box>
      {/* Toolbar — excluded from PDF capture (outside reportRef) */}
      <Box sx={s.toolbar}>
        <Typography variant="h5" sx={s.pageTitle}>Reports</Typography>
        <Box sx={s.controls}>
          <ToggleButtonGroup
            value={range}
            exclusive
            size="small"
            onChange={(_, val) => val && setRange(val)}
          >
            {RANGES.map(r => (
              <ToggleButton key={r} value={r} sx={{ textTransform: 'none', px: 2 }}>
                {r}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Button
            variant="contained"
            size="small"
            sx={s.exportButton}
            onClick={handleExport}
            disabled={loading || exporting}
            startIcon={exporting ? <CircularProgress size={14} color="inherit" /> : null}
          >
            {exporting ? 'Exporting…' : 'Export PDF'}
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      {emailStatus === 'sending' && (
        <Alert severity="info" sx={{ mb: 2 }}>Sending report to your email…</Alert>
      )}
      {emailStatus === 'sent' && (
        <Alert severity="success" sx={{ mb: 2 }}>Report emailed to your account address.</Alert>
      )}
      {emailStatus === 'error' && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          PDF downloaded but email failed — check your Resend setup.
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={s.previewWrapper}>
          <ReportDocument ref={reportRef} records={records} profile={profile} range={range} />
        </Box>
      )}
    </Box>
  )
}
