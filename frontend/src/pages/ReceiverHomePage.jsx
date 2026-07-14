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
  Divider,
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
    scrollToDashboard()
  }

  const handleNotificationClick = () => {
    setTab(0)
    scrollToDashboard()
    dispatch(fetchAvailableListings())
  }

  const handleBadgeClick = () => {
    setTab(1)
    scrollToDashboard()
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
          <IconButton color="inherit" onClick={handleBadgeClick} sx={{ mr: 1 }} aria-label="Notifications">
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

      {/* 1. Hero */}
      <ReceiverHero
        username={user?.username}
        onLearnMore={scrollToAbout}
        onGetStarted={scrollToDashboard}
      />

      {/* 2. About — first content section */}
      <DonorAboutSection role="RECEIVER" onGetStarted={scrollToDashboard} />

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
              Find & Claim Food Events
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560, mx: { md: 'auto' } }}>
              Browse available donations, respond to events near you, and keep your verification profile up to date.
            </Typography>
          </Box>

          {!profileComplete && (
            <Alert
              severity="warning"
              sx={{ mb: 3 }}
              action={
                <Button color="inherit" size="small" onClick={handleGoToProfile}>
                  Complete now
                </Button>
              }
            >
              Complete your verification profile before accepting food events.
            </Alert>
          )}

          <ReceiverStats
            availableCount={availableListings.length}
            unreadCount={unreadCount}
            acceptedCount={acceptedCount}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearReceiverMessages())}>
              {error}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }} onClose={() => dispatch(clearReceiverMessages())}>
              {successMessage}
            </Alert>
          )}

          <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                bgcolor: 'grey.50',
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  py: 2,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  gap: 1,
                  minWidth: { xs: 120, sm: 160 },
                },
              }}
            >
              <Tab
                icon={<EventAvailableIcon />}
                iconPosition="start"
                label={`Events (${availableListings.length})`}
              />
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

export default ReceiverHomePage
