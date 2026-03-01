export const severitySectionStyles = {
  toggleGroup: {
    flexWrap: 'wrap',
    gap: 1,
  },
  severityButton: (color: string) => ({
    borderRadius: 2,
    textTransform: 'none' as const,
    '&.Mui-selected': {
      bgcolor: color,
      color: '#fff',
      borderColor: color,
    },
    '&.Mui-selected:hover': {
      bgcolor: color,
      opacity: 0.9,
    },
  }),
}
