import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import HistoryIcon from '@mui/icons-material/History'
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined'
import PetsIcon from '@mui/icons-material/Pets'
import type { Page } from '../types'
import { sidebarStyles as s } from './Sidebar.styles'

const NAV_ITEMS: { label: string; page: Page; icon: React.ReactNode }[] = [
  { label: 'Dashboard',   page: 'dashboard', icon: <DashboardOutlinedIcon fontSize="small" /> },
  { label: 'Log Seizure', page: 'log',       icon: <AddCircleOutlineIcon fontSize="small" /> },
  { label: 'History',     page: 'history',   icon: <HistoryIcon fontSize="small" /> },
  { label: 'Reports',     page: 'reports',   icon: <AssessmentOutlinedIcon fontSize="small" /> },
  { label: 'Profile',     page: 'profile',   icon: <PetsIcon fontSize="small" /> },
]

interface SidebarProps {
  currentPage: Page
  onNavigate: (page: Page) => void
  width: number
}

export default function Sidebar({ currentPage, onNavigate, width }: SidebarProps) {
  return (
    <Box sx={s.container(width)}>
      <List disablePadding>
        {NAV_ITEMS.map(({ label, page, icon }) => (
          <ListItem key={page} disablePadding sx={s.navItem}>
            <ListItemButton
              selected={currentPage === page}
              onClick={() => onNavigate(page)}
              sx={s.navButton}
            >
              <ListItemIcon sx={s.navIcon}>{icon}</ListItemIcon>
              <ListItemText
                primary={label}
                slotProps={{
                  primary: {
                    fontWeight: currentPage === page ? 700 : 400,
                    fontSize: '0.95rem',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
