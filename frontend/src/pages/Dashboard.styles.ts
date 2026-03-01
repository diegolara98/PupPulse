export const dashboardStyles = {
  pageTitle: {
    fontWeight: 700,
    mb: 3,
  },
  statsRow: {
    display: 'flex',
    gap: 2,
    mb: 4,
  },
  statCard: {
    flex: 1,
    borderRadius: 3,
  },
  statValue: {
    color: 'primary.light',
  },
  recentCard: {
    borderRadius: 3,
    mb: 4,
  },
  recentRow: {
    display: 'flex',
    justifyContent: 'space-between',
    py: 1.5,
  },
  recentMeta: {
    display: 'flex',
    gap: 2,
  },
  // Accepts a pre-resolved colour string so the component owns the lookup
  // (via SEVERITY_COLORS) and this file stays free of business logic.
  severityText: (color: string) => ({
    color,
    fontWeight: 600,
  }),
  ctaButton: {
    borderRadius: 2,
    px: 4,
    mt: 1,
    bgcolor: 'primary.main',
    '&:hover': { bgcolor: 'primary.dark' },
  },
}
