export const sidebarStyles = {
  container: (width: number) => ({
    width,
    flexShrink: 0,
    bgcolor: 'background.paper',
    borderRight: '1px solid',
    borderColor: 'divider',
    pt: 2,
    height: '100%',
  }),
  navItem: {
    px: 1,
    mb: 0.5,
  },
  navButton: {
    borderRadius: 2,
    '&.Mui-selected': {
      bgcolor: 'rgba(103, 76, 167, 0.2)',
      color: 'primary.light',
    },
    '&.Mui-selected:hover': {
      bgcolor: 'rgba(103, 76, 167, 0.3)',
    },
    '&:hover': {
      bgcolor: 'rgba(255, 255, 255, 0.05)',
    },
  },
  navIcon: {
    minWidth: 36,  // MUI default is 56 — tighten it up for a compact sidebar
    color: 'inherit', // inherits primary.light from Mui-selected on the parent button
  },
}
