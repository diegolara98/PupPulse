export const logSeizureStyles = {
  wrapper: {
    maxWidth: 720,
    mx: 'auto',
  },
  pageTitle: {
    fontWeight: 700,
    mb: 3,
  },
  dateTimeRow: {
    display: 'flex',
    gap: 2,
  },
  durationRow: {
    display: 'flex',
    gap: 2,
    alignItems: 'flex-start',
  },
  warningChip: {
    mt: 2,
    borderRadius: 2,
  },
  toggleGroup: {
    flexWrap: 'wrap',
    gap: 1,
  },
  toggleButton: {
    borderRadius: 2,
    textTransform: 'none' as const,
  },
  severityButton: (color: string) => ({
    borderRadius: 2,
    textTransform: 'none' as const,
    '&.Mui-selected': {
      bgcolor: color,
      color: '#fff',
      borderColor: color,
    },
    '&.Mui-selected:hover': {
      bgcolor: color,
      opacity: 0.9,
    },
  }),
  checkboxGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 0.5,
  },
  recoveryField: {
    mb: 2,
  },
  conditionalField: {
    mt: 2,
  },
  medRow: {
    display: 'flex',
    gap: 2,
    mt: 2,
  },
  alerts: {
    mb: 2,
  },
  submitRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    mb: 4,
  },
  submitButton: {
    borderRadius: 2,
    px: 5,
    bgcolor: 'primary.main',
    '&:hover': { bgcolor: 'primary.dark' },
  },
}
