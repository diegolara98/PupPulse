export const reportsStyles = {
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 3,
  },
  pageTitle: {
    fontWeight: 700,
  },
  controls: {
    display: 'flex',
    gap: 2,
    alignItems: 'center',
  },
  exportButton: {
    borderRadius: 2,
    px: 3,
    bgcolor: 'primary.main',
    '&:hover': { bgcolor: 'primary.dark' },
    textTransform: 'none',
  },
  previewWrapper: {
    overflow: 'auto',
    borderRadius: 3,
    border: '1px solid',
    borderColor: 'divider',
  },
}
