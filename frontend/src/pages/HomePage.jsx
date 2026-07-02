import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import DonorHomePage from './DonorHomePage'
import ReceiverHomePage from './ReceiverHomePage'
import { fetchCurrentUser } from '../store/authSlice'

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
