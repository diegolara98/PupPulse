export const historyStyles = {
  wrapper: {
    maxWidth: 720,
    mx: 'auto',
  },
  pageTitle: {
    fontWeight: 700,
    mb: 3,
  },
  filterRow: {
    display: 'flex',
    gap: 2,
    alignItems: 'center',
    mb: 3,
    flexWrap: 'wrap',
  },
  filterField: {
    minWidth: 130,
  },
  clearButton: {
    textTransform: 'none',
    color: 'text.secondary',
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
    mt: 6,
  },
  alert: {
    mb: 2,
  },
  emptyCard: {
    borderRadius: 3,
  },
  recordCard: {
    borderRadius: 3,
    mb: 2,
  },
  cardContent: {
    '&:last-child': { pb: 2 },
  },
  summaryRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },
  chips: {
    display: 'flex',
    gap: 1,
    flexWrap: 'wrap',
    flex: 1,
  },
  severityChip: (color: string) => ({
    bgcolor: color,
    color: '#fff',
    fontWeight: 600,
  }),
  expandButton: {
    ml: 'auto',
    fontSize: '0.65rem',
    color: 'text.secondary',
  },
  divider: {
    my: 2,
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 2,
  },
  detailLabel: {
    color: 'primary.light',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    display: 'block',
    mb: 0.5,
  },
  notesBox: {
    gridColumn: '1 / -1',
  },
}
