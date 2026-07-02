import Grid from '@mui/material/Grid2'
import { Box, Paper, Typography } from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import BlockIcon from '@mui/icons-material/Block'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import dayjs from 'dayjs'

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

function DonorStats({ listings }) {
  const total = listings.length
  const available = listings.filter((l) => l.status === 'AVAILABLE').length
  const notAvailable = listings.filter((l) => l.status === 'CANCELLED').length
  const expiringSoon = listings.filter((l) => {
    if (l.status !== 'AVAILABLE') return false
    const hoursLeft = dayjs(l.expires_at).diff(dayjs(), 'hour')
    return hoursLeft >= 0 && hoursLeft <= 24
  }).length

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          icon={<EventIcon />}
          label="Total Events"
          value={total}
          color="primary"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          icon={<CheckCircleOutlineIcon />}
          label="Available"
          value={available}
          color="success"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          icon={<BlockIcon />}
          label="Not Available"
          value={notAvailable}
          color="warning"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          icon={<AccessTimeIcon />}
          label="Expiring in 24h"
          value={expiringSoon}
          color="info"
        />
      </Grid>
    </Grid>
  )
}

export default DonorStats
