export const summarySectionStyles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 2,
  },
  card: {
    borderRadius: 2,
    p: 1.5,
    bgcolor: 'background.default',
    textAlign: 'center',
  },
  value: {
    fontWeight: 700,
    fontSize: '1.4rem',
    color: 'primary.light',
    lineHeight: 1.2,
    mb: 0.25,
  },
  label: {
    fontSize: '0.7rem',
    color: 'text.secondary',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
}
