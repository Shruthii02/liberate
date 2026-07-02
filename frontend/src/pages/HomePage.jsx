import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Toolbar,
  Typography,
} from '@mui/material'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import DonorHomePage from './DonorHomePage'
import { fetchCurrentUser, logoutUser } from '../store/authSlice'

function ReceiverHomePage() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <RestaurantIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Liberate
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom>
          Welcome{user?.username ? `, ${user.username}` : ''}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Receiver features coming soon.
        </Typography>
      </Container>
    </Box>
  )
}

function HomePage() {
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    let active = true

    const loadProfile = async () => {
      if (isAuthenticated && !user?.role) {
        await dispatch(fetchCurrentUser())
      }
      if (active) {
        setProfileLoading(false)
      }
    }

    loadProfile()

    return () => {
      active = false
    }
  }, [dispatch, isAuthenticated, user?.role])

  if (profileLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (user?.role === 'DONOR') {
    return <DonorHomePage />
  }

  return <ReceiverHomePage />
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth)
  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }
  return children
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth)
  if (isAuthenticated) {
    return <Navigate to="/home" replace />
  }
  return children
}

export { HomePage, ProtectedRoute, PublicRoute }
