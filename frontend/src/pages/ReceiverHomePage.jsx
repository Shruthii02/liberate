import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Alert,
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@mui/material'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import NotificationsIcon from '@mui/icons-material/Notifications'
import PersonIcon from '@mui/icons-material/Person'
import ReceiverHero from '../components/receiver/ReceiverHero'
import ReceiverStats from '../components/receiver/ReceiverStats'
import AvailableEventsList from '../components/receiver/AvailableEventsList'
import NotificationPanel from '../components/receiver/NotificationPanel'
import ReceiverProfileForm from '../components/receiver/ReceiverProfileForm'
import DonorAboutSection from '../components/donor/DonorAboutSection'
import { logoutUser } from '../store/authSlice'
import {
  fetchNotifications,
  fetchUnreadCount,
} from '../store/notificationSlice'
import {
  clearReceiverMessages,
  fetchAvailableListings,
  fetchReceiverProfile,
} from '../store/receiverSlice'
import { IMAGES } from '../constants/images'

function ReceiverHomePage() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { notifications, unreadCount, loading: notificationsLoading } = useSelector(
    (state) => state.notifications
  )
  const {
    availableListings,
    profile,
    acceptedCount,
    loading,
    error,
    successMessage,
    locationFilter,
  } = useSelector((state) => state.receiver)
  const [tab, setTab] = useState(0)

  const profileComplete = Boolean(profile?.is_complete)

  useEffect(() => {
    dispatch(fetchAvailableListings())
    dispatch(fetchNotifications())
    dispatch(fetchUnreadCount())
    dispatch(fetchReceiverProfile())
  }, [dispatch])

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
    dispatch(clearReceiverMessages())
    setTab(value)
  }

  const handleGoToProfile = () => {
    setTab(2)
  }

  const handleNotificationClick = () => {
    setTab(0)
    if (locationFilter.mode === 'nearby' && locationFilter.lat != null && locationFilter.lng != null) {
      dispatch(
        fetchAvailableListings({
          lat: locationFilter.lat,
          lng: locationFilter.lng,
          radius_km: locationFilter.radiusKm,
        })
      )
    } else {
      dispatch(fetchAvailableListings())
    }
  }

  const handleBadgeClick = () => {
    setTab(1)
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
          <IconButton color="inherit" onClick={handleBadgeClick} sx={{ mr: 1 }}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mr: 2 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: 14 }}>
              {user?.username?.charAt(0)?.toUpperCase() || 'R'}
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

      <ReceiverHero username={user?.username} />

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
          <ReceiverStats
            availableCount={availableListings.length}
            unreadCount={unreadCount}
            acceptedCount={acceptedCount}
          />

          {error && (
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
              <Tab icon={<EventAvailableIcon />} iconPosition="start" label="Available Events" />
              <Tab
                icon={
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                }
                iconPosition="start"
                label="Notifications"
              />
              <Tab icon={<PersonIcon />} iconPosition="start" label="My Profile" />
            </Tabs>

            <Box sx={{ p: { xs: 2, md: 3 } }}>
              {tab === 0 && (
                <AvailableEventsList
                  listings={availableListings}
                  loading={loading}
                  profileComplete={profileComplete}
                  onGoToProfile={handleGoToProfile}
                />
              )}
              {tab === 1 && (
                <NotificationPanel
                  notifications={notifications}
                  loading={notificationsLoading}
                  onNotificationClick={handleNotificationClick}
                />
              )}
              {tab === 2 && <ReceiverProfileForm />}
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

export default ReceiverHomePage
