export const authStyles = {
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    bgcolor: 'background.default',
    p: 2,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 3,
  },
  cardContent: {
    p: 4,
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1.5,
    mb: 3,
  },
  logo: {
    height: 52,
    width: 52,
  },
  appName: {
    fontWeight: 700,
    color: 'primary.light',
  },
  heading: {
    fontWeight: 600,
    textAlign: 'center',
    mb: 3,
  },
  alert: {
    mb: 2,
  },
  field: {
    mb: 2,
  },
  submitButton: {
    mt: 1,
    mb: 2,
    borderRadius: 2,
    bgcolor: 'primary.main',
    '&:hover': { bgcolor: 'primary.dark' },
  },
  toggleRow: {
    textAlign: 'center',
    color: 'text.secondary',
  },
  toggleLink: {
    color: 'primary.light',
    cursor: 'pointer',
    textDecoration: 'none',
    '&:hover': { textDecoration: 'underline' },
  },
}
