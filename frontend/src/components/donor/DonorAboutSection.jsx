import Grid from '@mui/material/Grid2'
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import FavoriteIcon from '@mui/icons-material/Favorite'
import NatureIcon from '@mui/icons-material/Nature'
import GroupsIcon from '@mui/icons-material/Groups'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { IMAGES } from '../../constants/images'

const FEATURES = [
  {
    icon: <FavoriteIcon color="primary" />,
    title: 'Fight Hunger',
    description:
      'Connect surplus food from events, restaurants, and kitchens with receivers in your community.',
  },
  {
    icon: <NatureIcon color="primary" />,
    title: 'Reduce Waste',
    description:
      'Every listing helps prevent good food from going to waste and supports a sustainable future.',
  },
  {
    icon: <GroupsIcon color="primary" />,
    title: 'Build Community',
    description:
      'Donors and receivers work together to make food access faster, fairer, and more local.',
  },
  {
    icon: <LocationOnIcon color="primary" />,
    title: 'Location-Based Pickup',
    description:
      'GPS-enabled pickup points help receivers find food donations quickly and safely nearby.',
  },
]

function DonorAboutSection({ role = 'DONOR', onGetStarted }) {
  const isDonor = role === 'DONOR'
  const description = isDonor
    ? 'Liberate connects donors who have surplus meals with receivers who need them. Register events, set pickup locations, and manage availability in one place.'
    : 'Liberate helps receivers find surplus food nearby. Browse available events, get notified when donors share meals, and accept what your community needs.'

  return (
    <Box
      id="about"
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: 'background.paper',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5} alignItems="center">
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: 3,
                minHeight: { xs: 240, md: 360 },
                backgroundImage: `url(${IMAGES.about})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="overline" color="primary" sx={{ letterSpacing: 2, fontWeight: 700 }}>
              About Liberate
            </Typography>
            <Typography variant="h3" fontWeight={800} gutterBottom sx={{ mt: 1, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
              A platform for sharing food with purpose
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
              {description}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
              Our mission is simple: reduce food waste, support communities, and make every surplus meal count.
            </Typography>
            {onGetStarted && (
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowDownwardIcon />}
                onClick={onGetStarted}
                sx={{ mt: 1, px: 3, py: 1.25 }}
              >
                {isDonor ? 'Register a Food Event' : 'Browse Available Events'}
              </Button>
            )}
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: { xs: 4, md: 6 } }}>
          {FEATURES.map((feature) => (
            <Grid key={feature.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 2,
                  },
                }}
              >
                <Stack spacing={1.5}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={700}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default DonorAboutSection
