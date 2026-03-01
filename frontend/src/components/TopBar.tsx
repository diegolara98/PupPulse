import { AppBar, Toolbar, Box, Typography, Button } from '@mui/material'
import pupPulseLogo from '../assets/PupPulseIcon.svg'
import { topBarStyles as s } from './TopBar.styles'

interface TopBarProps {
  userEmail?: string
  onSignOut: () => void
}

export default function TopBar({ userEmail, onSignOut }: TopBarProps) {
  return (
    <AppBar position="static" elevation={1} sx={s.appBar}>
      <Toolbar>
        <Box component="img" src={pupPulseLogo} alt="PupPulse" sx={s.logo} />
        <Typography variant="h6" sx={s.title}>
          PupPulse
        </Typography>
        <Box sx={s.spacer} />
        {userEmail && (
          <Typography sx={s.userEmail}>{userEmail}</Typography>
        )}
        <Button onClick={onSignOut} sx={s.signOutButton}>
          Sign Out
        </Button>
      </Toolbar>
    </AppBar>
  )
}
