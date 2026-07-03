import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs from 'dayjs'
import { useDispatch, useSelector } from 'react-redux'
import { clearFoodMessages, updateListing } from '../../store/foodSlice'
import { QUANTITY_UNITS, LISTING_STATUS_OPTIONS, formatUnit } from './listingConstants'

function EditListingDialog({ open, listing, onClose }) {
  const dispatch = useDispatch()
  const { loading, error, successMessage } = useSelector((state) => state.food)

  const [formData, setFormData] = useState({
    organization_event_name: '',
    food_name: '',
    quantity: '',
    quantity_unit: 'PLATES',
    expires_at: dayjs().add(1, 'day'),
    other_details: '',
    address: '',
    latitude: '',
    longitude: '',
    landmark: '',
    status: 'AVAILABLE',
  })

  const acceptedClaims = (listing?.claims || []).filter((claim) => claim.response === 'ACCEPTED')
  const hasAcceptedClaims = acceptedClaims.length > 0
  const isPartiallyClaimed = listing?.status === 'PARTIALLY_CLAIMED'

  useEffect(() => {
    if (listing) {
      setFormData({
        organization_event_name: listing.organization_event_name,
        food_name: listing.food_name,
        quantity: listing.quantity,
        quantity_unit: listing.quantity_unit,
        expires_at: dayjs(listing.expires_at),
        other_details: listing.other_details || '',
        address: listing.location?.address || '',
        latitude: listing.location?.latitude || '',
        longitude: listing.location?.longitude || '',
        landmark: listing.location?.landmark || '',
        status: listing.status === 'CANCELLED' ? 'CANCELLED' : listing.status,
      })
    }
  }, [listing])

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    dispatch(clearFoodMessages())

    const payload = {
      organization_event_name: formData.organization_event_name,
      food_name: formData.food_name,
      quantity_unit: formData.quantity_unit,
      expires_at: formData.expires_at.toISOString(),
      other_details: formData.other_details,
      status: formData.status,
      location: {
        address: formData.address,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        landmark: formData.landmark,
      },
    }

    if (!hasAcceptedClaims) {
      payload.quantity = parseInt(formData.quantity, 10)
    }

    const result = await dispatch(updateListing({ id: listing.id, data: payload }))
    if (updateListing.fulfilled.match(result)) {
      onClose()
    }
  }

  if (!listing) return null

  const remaining = listing.remaining_quantity ?? listing.quantity
  const claimed = listing.quantity - remaining

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Food Event</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          {hasAcceptedClaims && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Original: {listing.quantity} · Remaining: {remaining} · Claimed: {claimed}{' '}
                {formatUnit(listing.quantity_unit)}
              </Typography>
              {acceptedClaims.map((claim) => (
                <Typography key={claim.id} variant="body2">
                  {claim.receiver_full_name || claim.receiver_username}
                  {claim.organization_name ? ` (${claim.organization_name})` : ''} —{' '}
                  {claim.accepted_quantity} {formatUnit(listing.quantity_unit)}
                </Typography>
              ))}
            </Alert>
          )}

          <TextField
            label="Organization / Event Name"
            value={formData.organization_event_name}
            onChange={handleChange('organization_event_name')}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Food Name"
            value={formData.food_name}
            onChange={handleChange('food_name')}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange('quantity')}
              required={!hasAcceptedClaims}
              disabled={hasAcceptedClaims}
              helperText={hasAcceptedClaims ? 'Quantity cannot be changed after claims exist' : ''}
              sx={{ flex: 1 }}
            />
            <FormControl sx={{ flex: 1 }}>
              <InputLabel>Unit</InputLabel>
              <Select
                value={formData.quantity_unit}
                label="Unit"
                onChange={handleChange('quantity_unit')}
              >
                {QUANTITY_UNITS.map((unit) => (
                  <MenuItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <DateTimePicker
            label="Expires At"
            value={formData.expires_at}
            onChange={(value) => setFormData((prev) => ({ ...prev, expires_at: value }))}
            minDateTime={dayjs()}
            sx={{ width: '100%', mb: 2 }}
          />
          <TextField
            label="Other Details"
            value={formData.other_details}
            onChange={handleChange('other_details')}
            fullWidth
            multiline
            rows={2}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Address"
            value={formData.address}
            onChange={handleChange('address')}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Landmark"
            value={formData.landmark}
            onChange={handleChange('landmark')}
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={handleChange('status')}
            >
              {isPartiallyClaimed && (
                <MenuItem value="PARTIALLY_CLAIMED" disabled>
                  Partially Claimed
                </MenuItem>
              )}
              {LISTING_STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default EditListingDialog
