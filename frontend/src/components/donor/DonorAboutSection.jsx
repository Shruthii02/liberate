import Grid from '@mui/material/Grid2'
import {
  Box,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import NatureIcon from '@mui/icons-material/Nature'
import GroupsIcon from '@mui/icons-material/Groups'
import LocationOnIcon from '@mui/icons-material/LocationOn'
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

function DonorAboutSection() {
  return (
    <Box
      id="about"
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: 3,
                minHeight: 320,
                backgroundImage: `url(${IMAGES.about})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="overline" color="primary" sx={{ letterSpacing: 2 }}>
              About Liberate
            </Typography>
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mt: 1 }}>
              A platform for sharing food with purpose
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Liberate is a food distribution platform that connects donors who have surplus
              meals with receivers who need them. As a donor, you can register events, set
              pickup locations, and manage availability in one place.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Our mission is simple: reduce food waste, support communities, and make every
              surplus meal count.
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 4 }}>
          {FEATURES.map((feature) => (
            <Grid key={feature.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <Stack spacing={1.5}>
                  {feature.icon}
                  <Typography variant="h6" fontWeight={600}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
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
