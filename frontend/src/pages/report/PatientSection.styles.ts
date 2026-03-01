export const patientSectionStyles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 2,
  },
  field: {
    mb: 1.5,
  },
  label: {
    color: 'primary.light',
    fontWeight: 700,
    fontSize: '0.65rem',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
    display: 'block',
    mb: 0.25,
  },
  value: {
    fontSize: '0.9rem',
  },
  noProfile: {
    color: 'text.secondary',
    fontStyle: 'italic',
  },
}
