import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@mui/material'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import ListAltIcon from '@mui/icons-material/ListAlt'
import DonorHero from '../components/donor/DonorHero'
import DonorStats from '../components/donor/DonorStats'
import DonorAboutSection from '../components/donor/DonorAboutSection'
import FoodListingForm from '../components/donor/FoodListingForm'
import MyListingsTable from '../components/donor/MyListingsTable'
import { logoutUser } from '../store/authSlice'
import { clearFoodMessages, fetchMyListings } from '../store/foodSlice'
import { IMAGES } from '../constants/images'

function DonorHomePage() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { listings, loading, error, successMessage } = useSelector((state) => state.food)
  const [tab, setTab] = useState(0)

  useEffect(() => {
    dispatch(fetchMyListings())
  }, [dispatch])

  useEffect(() => {
    if (successMessage) {
      setTab(1)
    }
  }, [successMessage])

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToDashboard = () => {
    document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleTabChange = (_, value) => {
    dispatch(clearFoodMessages())
    setTab(value)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'primary.dark' }}>
        <Toolbar>
          <RestaurantIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Liberate
          </Typography>
          <Button color="inherit" onClick={scrollToDashboard} sx={{ mr: 1, display: { xs: 'none', sm: 'inline-flex' } }}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={scrollToAbout} sx={{ mr: 2, display: { xs: 'none', sm: 'inline-flex' } }}>
            About
          </Button>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mr: 2 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: 14 }}>
              {user?.username?.charAt(0)?.toUpperCase() || 'D'}
            </Avatar>
            <Typography variant="body2" sx={{ display: { xs: 'none', md: 'block' } }}>
              {user?.username}
            </Typography>
          </Stack>
          <Button variant="outlined" color="inherit" onClick={handleLogout} size="small">
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <DonorHero username={user?.username} />

      <Box
        id="dashboard"
        sx={{
          position: 'relative',
          py: { xs: 4, md: 5 },
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(rgba(244, 247, 244, 0.94), rgba(244, 247, 244, 0.97)), url(${IMAGES.pageBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: { md: 'fixed' },
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <DonorStats listings={listings} />

          {error && !loading && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
            </Alert>
          )}

          <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                bgcolor: 'grey.50',
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  py: 2,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  gap: 1,
                },
              }}
            >
              <Tab icon={<AddCircleOutlineIcon />} iconPosition="start" label="Register Event" />
              <Tab icon={<ListAltIcon />} iconPosition="start" label="My Events" />
            </Tabs>

            <Box sx={{ p: { xs: 2, md: 3 } }}>
              {tab === 0 ? (
                <FoodListingForm embedded />
              ) : (
                <MyListingsTable listings={listings} loading={loading} embedded />
              )}
            </Box>
          </Paper>
        </Container>
      </Box>

      <DonorAboutSection />

      <Box
        component="footer"
        sx={{
          py: 3,
          textAlign: 'center',
          bgcolor: 'primary.dark',
          color: 'white',
        }}
      >
        <Typography variant="body2" sx={{ opacity: 0.85 }}>
          © {new Date().getFullYear()} Liberate — Connecting donors with receivers to reduce food waste.
        </Typography>
      </Box>
    </Box>
  )
}

export default DonorHomePage
