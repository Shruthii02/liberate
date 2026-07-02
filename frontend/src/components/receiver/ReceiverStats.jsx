import Grid from '@mui/material/Grid2'
import { Box, Paper, Typography } from '@mui/material'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

function StatCard({ icon, label, value, color }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: `${color}.50`,
          color: `${color}.main`,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h5" fontWeight={700}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Paper>
  )
}

function ReceiverStats({ availableCount, unreadCount, acceptedCount }) {
  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <StatCard
          icon={<EventAvailableIcon />}
          label="Available Events"
          value={availableCount}
          color="primary"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <StatCard
          icon={<NotificationsActiveIcon />}
          label="Unread Notifications"
          value={unreadCount}
          color="warning"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <StatCard
          icon={<CheckCircleOutlineIcon />}
          label="Accepted This Session"
          value={acceptedCount}
          color="success"
        />
      </Grid>
    </Grid>
  )
}

export default ReceiverStats
