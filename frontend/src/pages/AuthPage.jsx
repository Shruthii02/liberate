import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Card,
  CardContent,
  Container,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import { clearAuthMessages } from '../store/authSlice'

function AuthPage() {
  const dispatch = useDispatch()
  const { successMessage } = useSelector((state) => state.auth)
  const [tab, setTab] = useState(0)

  useEffect(() => {
    if (successMessage && tab === 1) {
      setTab(0)
    }
  }, [successMessage, tab])

  const switchTab = (newTab) => {
    dispatch(clearAuthMessages())
    setTab(newTab)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #e8f5e9 0%, #f4f7f4 50%, #fff8e1 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'white',
              mb: 2,
            }}
          >
            <RestaurantIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="h4" color="primary.dark" gutterBottom>
            Liberate
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Connect donors with receivers to reduce food waste
          </Typography>
        </Box>

        <Card elevation={4}>
          <Tabs
            value={tab}
            onChange={(_, value) => switchTab(value)}
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': { py: 2, fontSize: '1rem' },
            }}
          >
            <Tab label="Sign In" />
            <Tab label="Register" />
          </Tabs>

          <CardContent sx={{ px: { xs: 2, sm: 4 }, py: 3 }}>
            {tab === 0 ? (
              <LoginForm onSwitchToRegister={() => switchTab(1)} />
            ) : (
              <RegisterForm onSwitchToLogin={() => switchTab(0)} />
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default AuthPage
