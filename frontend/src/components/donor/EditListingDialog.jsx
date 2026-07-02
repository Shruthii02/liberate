import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
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
import { clearFoodMessages, updateListing } from '../../store/foodSlice'
import { LISTING_STATUS_OPTIONS, QUANTITY_UNITS } from './listingConstants'

function EditListingDialog({ listing, open, onClose }) {
  const dispatch = useDispatch()
  const { updating, error, successMessage } = useSelector((state) => state.food)
  const [formData, setFormData] = useState(null)
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null })
  const [expiryDate, setExpiryDate] = useState(dayjs())
  const [expiryTime, setExpiryTime] = useState(dayjs())
  const [validationError, setValidationError] = useState('')
  const [locating, setLocating] = useState(false)
  const [locationMessage, setLocationMessage] = useState('')

  useEffect(() => {
    if (listing && open) {
      const expiresAt = dayjs(listing.expires_at)
      setFormData({
        organization_event_name: listing.organization_event_name,
        food_name: listing.food_name,
        quantity: String(listing.quantity),
        quantity_unit: listing.quantity_unit,
        status: LISTING_STATUS_OPTIONS.some((option) => option.value === listing.status)
          ? listing.status
          : 'AVAILABLE',
        other_details: listing.other_details || '',
        address: listing.location.address,
        landmark: listing.location.landmark || '',
      })
      setCoordinates({
        latitude: listing.location.latitude,
        longitude: listing.location.longitude,
      })
      setExpiryDate(expiresAt)
      setExpiryTime(expiresAt)
      setValidationError('')
      setLocationMessage('')
      dispatch(clearFoodMessages())
    }
  }, [listing, open, dispatch])

  useEffect(() => {
    if (successMessage && open) {
      onClose()
    }
  }, [successMessage, open, onClose])

  if (!formData) {
    return null
  }

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
        setLocationMessage('Current location updated successfully.')
        setLocating(false)
      },
      () => {
        setValidationError('Unable to access your location. Please allow GPS permission.')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleSubmit = () => {
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

    const expiryDateTime = expiryDate
      .hour(expiryTime.hour())
      .minute(expiryTime.minute())
      .second(0)
      .millisecond(0)
    const minutesUntilExpiry = expiryDateTime.diff(dayjs(), 'minute')

    if (minutesUntilExpiry <= 0) {
      setValidationError('Expiry date and time must be in the future.')
      return
    }

    const expiryHours = Math.max(1, Math.ceil(minutesUntilExpiry / 60))

    dispatch(
      updateListing({
        id: listing.id,
        listingData: {
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
        },
      })
    )
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Food Listing</DialogTitle>
      <DialogContent dividers>
        {(error || validationError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {validationError || error}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ pt: 1 }}>
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
              <InputLabel id="edit-quantity-unit-label">Quantity Unit</InputLabel>
              <Select
                labelId="edit-quantity-unit-label"
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
              <InputLabel id="edit-status-label">Status</InputLabel>
              <Select
                labelId="edit-status-label"
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
              value={formData.other_details}
              onChange={handleChange('other_details')}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={updating}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={updating}>
          {updating ? <CircularProgress size={22} color="inherit" /> : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditListingDialog
