import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Alert,
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import FoodListingForm from '../components/donor/FoodListingForm'
import MyListingsTable from '../components/donor/MyListingsTable'
import { logoutUser } from '../store/authSlice'
import { clearFoodMessages, fetchMyListings } from '../store/foodSlice'

function DonorHomePage() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { listings, loading, error, successMessage } = useSelector((state) => state.food)

  useEffect(() => {
    dispatch(fetchMyListings())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <RestaurantIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Liberate Donor Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h4">
            Welcome{user?.username ? `, ${user.username}` : ''}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create a food listing and manage your donation events.
          </Typography>
        </Stack>

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

        <Stack spacing={4}>
          <FoodListingForm />
          <MyListingsTable listings={listings} loading={loading} />
        </Stack>
      </Container>
    </Box>
  )
}

export default DonorHomePage
