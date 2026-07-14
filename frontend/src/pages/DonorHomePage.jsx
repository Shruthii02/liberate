import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
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
      document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })
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
    if (value === 1) {
      dispatch(fetchMyListings())
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'primary.dark' }}>
        <Toolbar>
          <RestaurantIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Liberate
          </Typography>
          <Button color="inherit" onClick={scrollToAbout} sx={{ mr: 1, display: { xs: 'none', sm: 'inline-flex' } }}>
            About
          </Button>
          <Button color="inherit" onClick={scrollToDashboard} sx={{ mr: 2, display: { xs: 'none', sm: 'inline-flex' } }}>
            Events
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

      {/* 1. Hero */}
      <DonorHero
        username={user?.username}
        onLearnMore={scrollToAbout}
        onGetStarted={scrollToDashboard}
      />

      {/* 2. About — first content section */}
      <DonorAboutSection role="DONOR" onGetStarted={scrollToDashboard} />

      <Divider />

      {/* 3. Events / dashboard below about */}
      <Box
        id="dashboard"
        component="section"
        sx={{
          position: 'relative',
          py: { xs: 5, md: 7 },
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(rgba(244, 247, 244, 0.95), rgba(244, 247, 244, 0.98)), url(${IMAGES.pageBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ mb: 4, textAlign: { xs: 'left', md: 'center' } }}>
            <Typography variant="overline" color="primary" sx={{ letterSpacing: 2, fontWeight: 700 }}>
              Your Workspace
            </Typography>
            <Typography variant="h4" fontWeight={800} gutterBottom sx={{ mt: 0.5 }}>
              Register & Manage Food Events
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560, mx: { md: 'auto' } }}>
              Create a new surplus food listing or review and edit the events you have already shared.
            </Typography>
          </Box>

          <DonorStats listings={listings} />

          {error && !loading && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearFoodMessages())}>
              {error}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }} onClose={() => dispatch(clearFoodMessages())}>
              {successMessage}
            </Alert>
          )}

          <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
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
              <Tab
                icon={<ListAltIcon />}
                iconPosition="start"
                label={`My Events (${listings.length})`}
              />
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

      <Box
        component="footer"
        sx={{
          py: 3.5,
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
