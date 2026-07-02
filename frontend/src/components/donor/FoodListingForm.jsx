import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import dayjs from 'dayjs'
import { clearFoodMessages, createListing } from '../../store/foodSlice'
import { LISTING_STATUS_OPTIONS, QUANTITY_UNITS } from './listingConstants'

const initialFormState = {
  organization_event_name: '',
  food_name: '',
  quantity: '',
  quantity_unit: 'PLATES',
  status: 'AVAILABLE',
  other_details: '',
  address: '',
  landmark: '',
}

function FoodListingForm({ embedded = false }) {
  const dispatch = useDispatch()
  const { creating, error, successMessage } = useSelector((state) => state.food)
  const [formData, setFormData] = useState(initialFormState)
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null })
  const [expiryDate, setExpiryDate] = useState(dayjs().add(1, 'day'))
  const [expiryTime, setExpiryTime] = useState(dayjs().add(2, 'hour'))
  const [validationError, setValidationError] = useState('')
  const [locating, setLocating] = useState(false)
  const [locationMessage, setLocationMessage] = useState('')

  useEffect(() => {
    if (successMessage) {
      setFormData(initialFormState)
      setCoordinates({ latitude: null, longitude: null })
      setExpiryDate(dayjs().add(1, 'day'))
      setExpiryTime(dayjs().add(2, 'hour'))
      setLocationMessage('')
    }
  }, [successMessage])

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }))
    setValidationError('')
    dispatch(clearFoodMessages())
  }

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setValidationError('Geolocation is not supported by your browser.')
      return
    }

    setLocating(true)
    setValidationError('')
    setLocationMessage('')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setLocationMessage('Current location captured successfully.')
        setLocating(false)
      },
      () => {
        setValidationError('Unable to access your location. Please allow GPS permission.')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const buildExpiryDateTime = () =>
    expiryDate
      .hour(expiryTime.hour())
      .minute(expiryTime.minute())
      .second(0)
      .millisecond(0)

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(clearFoodMessages())
    setValidationError('')

    if (!formData.organization_event_name.trim()) {
      setValidationError('Organization / event name is required.')
      return
    }
    if (!formData.food_name.trim()) {
      setValidationError('Food name is required.')
      return
    }
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      setValidationError('Quantity must be greater than 0.')
      return
    }
    if (!formData.address.trim()) {
      setValidationError('Pickup address is required.')
      return
    }
    if (coordinates.latitude === null || coordinates.longitude === null) {
      setValidationError('Please click "Use My Current Location" to set the pickup point.')
      return
    }

    const expiryDateTime = buildExpiryDateTime()
    const minutesUntilExpiry = expiryDateTime.diff(dayjs(), 'minute')

    if (minutesUntilExpiry <= 0) {
      setValidationError('Expiry date and time must be in the future.')
      return
    }

    const expiryHours = Math.max(1, Math.ceil(minutesUntilExpiry / 60))

    dispatch(
      createListing({
        organization_event_name: formData.organization_event_name.trim(),
        food_name: formData.food_name.trim(),
        quantity: Number(formData.quantity),
        quantity_unit: formData.quantity_unit,
        expiry_hours: expiryHours,
        status: formData.status,
        other_details: formData.other_details.trim(),
        location: {
          address: formData.address.trim(),
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          landmark: formData.landmark.trim(),
        },
      })
    )
  }

  const formContent = (
    <>
      {!embedded && (
        <>
          <Typography variant="h6" gutterBottom>
            Create Food Listing
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Share surplus food with receivers in your area.
          </Typography>
        </>
      )}

      {(error || validationError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {validationError || error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              required
              fullWidth
              label="Organization / Event Name"
              value={formData.organization_event_name}
              onChange={handleChange('organization_event_name')}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              required
              fullWidth
              label="Food Name"
              value={formData.food_name}
              onChange={handleChange('food_name')}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              required
              fullWidth
              type="number"
              label="Quantity"
              inputProps={{ min: 1 }}
              value={formData.quantity}
              onChange={handleChange('quantity')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FormControl fullWidth required>
              <InputLabel id="quantity-unit-label">Quantity Unit</InputLabel>
              <Select
                labelId="quantity-unit-label"
                label="Quantity Unit"
                value={formData.quantity_unit}
                onChange={handleChange('quantity_unit')}
              >
                {QUANTITY_UNITS.map((unit) => (
                  <MenuItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth required>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                label="Status"
                value={formData.status}
                onChange={handleChange('status')}
              >
                {LISTING_STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <DatePicker
              label="Expiry Date"
              value={expiryDate}
              onChange={(value) => value && setExpiryDate(value)}
              minDate={dayjs()}
              slotProps={{ textField: { fullWidth: true, required: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TimePicker
              label="Expiry Time"
              value={expiryTime}
              onChange={(value) => value && setExpiryTime(value)}
              ampm
              slotProps={{ textField: { fullWidth: true, required: true } }}
            />
          </Grid>

          <Grid size={12}>
            <Divider sx={{ my: 1 }} />
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <LocationOnIcon color="primary" />
              <Typography variant="subtitle1">Pickup Location</Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              required
              fullWidth
              label="Address"
              placeholder="Street, area, city"
              value={formData.address}
              onChange={handleChange('address')}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Landmark (optional)"
              value={formData.landmark}
              onChange={handleChange('landmark')}
            />
          </Grid>

          <Grid size={12}>
            <Button
              variant="outlined"
              startIcon={locating ? <CircularProgress size={18} /> : <MyLocationIcon />}
              onClick={handleUseCurrentLocation}
              disabled={locating}
            >
              Use My Current Location
            </Button>
            {locationMessage && (
              <Typography variant="caption" color="success.main" sx={{ ml: 2 }}>
                {locationMessage}
              </Typography>
            )}
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Other Details (optional)"
              placeholder="Dietary info, pickup instructions, packaging details..."
              value={formData.other_details}
              onChange={handleChange('other_details')}
            />
          </Grid>

          <Grid size={12}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={creating}
              sx={{ minWidth: 180 }}
            >
              {creating ? <CircularProgress size={24} color="inherit" /> : 'Create Listing'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  )

  if (embedded) {
    return formContent
  }

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, md: 3 } }}>
      {formContent}
    </Paper>
  )
}

export default FoodListingForm
