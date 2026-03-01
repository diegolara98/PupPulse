export const notableEventsStyles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 2,
  },
  card: {
    bgcolor: 'background.default',
    borderRadius: 2,
    p: 2,
  },
  count: {
    fontWeight: 700,
    fontSize: '2rem',
    color: 'primary.light',
    lineHeight: 1,
    mb: 0.5,
  },
  cardLabel: {
    fontWeight: 700,
    fontSize: '0.7rem',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    color: 'text.secondary',
    mb: 1,
  },
  detail: {
    fontSize: '0.8rem',
    color: 'text.secondary',
    mb: 0.25,
  },
  none: {
    color: 'text.secondary',
    fontStyle: 'italic',
    fontSize: '0.85rem',
  },
}
