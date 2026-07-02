import { Box, Container, Stack, Typography } from '@mui/material'
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism'
import { IMAGES } from '../../constants/images'

function ReceiverHero({ username }) {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: 280, md: 340 },
        display: 'flex',
        alignItems: 'center',
        backgroundImage: `linear-gradient(135deg, rgba(0, 80, 5, 0.88) 0%, rgba(46, 125, 50, 0.78) 100%), url(${IMAGES.receiverHero})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={2} sx={{ maxWidth: 680 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <VolunteerActivismIcon sx={{ fontSize: 32 }} />
            <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.9 }}>
              Receiver Dashboard
            </Typography>
          </Stack>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            Welcome back{username ? `, ${username}` : ''}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.92, fontWeight: 400 }}>
            Browse available food events, get notified instantly, and accept what your community needs.
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}

export default ReceiverHero
