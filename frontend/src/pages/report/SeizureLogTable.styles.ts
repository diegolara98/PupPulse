export const seizureLogTableStyles = {
  table: {
    '& .MuiTableCell-root': {
      borderColor: 'divider',
      fontSize: '0.82rem',
      py: 0.75,
    },
    '& .MuiTableCell-head': {
      color: 'primary.light',
      fontWeight: 700,
      fontSize: '0.7rem',
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5,
    },
  },
  severityBadge: (color: string) => ({
    display: 'inline-block',
    bgcolor: color,
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.7rem',
    px: 0.75,
    py: 0.25,
    borderRadius: 1,
  }),
  noteText: {
    maxWidth: 180,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    color: 'text.secondary',
  },
  empty: {
    color: 'text.secondary',
    fontStyle: 'italic',
    py: 2,
  },
}
