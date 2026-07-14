import { Box, Button, Container, Stack, Typography } from '@mui/material'
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism'
import { IMAGES } from '../../constants/images'

function DonorHero({ username, onGetStarted, onLearnMore }) {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: 320, md: 420 },
        display: 'flex',
        alignItems: 'center',
        backgroundImage: `linear-gradient(135deg, rgba(0, 80, 5, 0.88) 0%, rgba(46, 125, 50, 0.78) 100%), url(${IMAGES.hero})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={2.5} sx={{ maxWidth: 680 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <VolunteerActivismIcon sx={{ fontSize: 32 }} />
            <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.9, fontWeight: 700 }}>
              Liberate · Donor
            </Typography>
          </Stack>
          <Typography
            variant="h2"
            component="h1"
            sx={{ fontWeight: 800, lineHeight: 1.15, fontSize: { xs: '2rem', md: '3rem' } }}
          >
            Welcome{username ? `, ${username}` : ''}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.92, fontWeight: 400, maxWidth: 520 }}>
            Share surplus food from your events and kitchens — help meals reach people who need them.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ pt: 1 }}>
            {onLearnMore && (
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={onLearnMore}
                sx={{ px: 3 }}
              >
                About Liberate
              </Button>
            )}
            {onGetStarted && (
              <Button
                variant="outlined"
                size="large"
                onClick={onGetStarted}
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.6)', px: 3 }}
              >
                Go to Events
              </Button>
            )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}

export default DonorHero
