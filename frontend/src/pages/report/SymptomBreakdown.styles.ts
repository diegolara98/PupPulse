export const symptomBreakdownStyles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 2,
  },
  columnTitle: {
    fontWeight: 700,
    color: 'primary.light',
    fontSize: '0.7rem',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    mb: 1.5,
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 0.75,
  },
  symptomLabel: {
    fontSize: '0.82rem',
    pr: 1,
  },
  pct: {
    fontSize: '0.8rem',
    color: 'primary.light',
    fontWeight: 600,
    flexShrink: 0,
  },
  empty: {
    fontSize: '0.82rem',
    color: 'text.secondary',
    fontStyle: 'italic',
  },
}
