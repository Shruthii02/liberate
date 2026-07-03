import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import NearMeIcon from '@mui/icons-material/NearMe'
import dayjs from 'dayjs'
import EventRespondDialog from './EventRespondDialog'
import EmptyState from '../layout/EmptyState'
import SectionHeader from '../layout/SectionHeader'
import { STATUS_COLORS, formatStatusLabel, formatUnit } from '../donor/listingConstants'
import {
  clearReceiverMessages,
  fetchAvailableListings,
  setLocationRadius,
} from '../../store/receiverSlice'
import { formatDistance, getCurrentPosition } from '../../utils/geolocation'

const RADIUS_OPTIONS = [
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 25, label: '25 km' },
  { value: 50, label: '50 km' },
]

function AvailableEventsList({ listings, loading, profileComplete, onGoToProfile }) {
  const dispatch = useDispatch()
  const { locationFilter } = useSelector((state) => state.receiver)
  const [selectedListing, setSelectedListing] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState('')

  const handleRespond = (listing) => {
    setSelectedListing(listing)
    setDialogOpen(true)
  }

  const loadAllEvents = () => {
    setLocationError('')
    dispatch(clearReceiverMessages())
    dispatch(fetchAvailableListings())
  }

  const loadNearbyEvents = async (radiusKm = locationFilter.radiusKm) => {
    setLocationError('')
    dispatch(clearReceiverMessages())
    setLocating(true)

    try {
      const { lat, lng } = await getCurrentPosition()
      await dispatch(fetchAvailableListings({ lat, lng, radius_km: radiusKm })).unwrap()
    } catch (error) {
      setLocationError(error.message || 'Unable to get your location.')
    } finally {
      setLocating(false)
    }
  }

  const handleFilterChange = (_, newMode) => {
    if (!newMode) return
    if (newMode === 'all') {
      loadAllEvents()
    } else {
      loadNearbyEvents()
    }
  }

  const handleRadiusChange = (event) => {
    const radiusKm = Number(event.target.value)
    dispatch(setLocationRadius(radiusKm))
    if (locationFilter.mode === 'nearby') {
      loadNearbyEvents(radiusKm)
    }
  }

  const filterBar = (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      alignItems={{ sm: 'center' }}
      justifyContent="space-between"
      sx={{ mb: 3 }}
    >
      <ToggleButtonGroup
        value={locationFilter.mode}
        exclusive
        onChange={handleFilterChange}
        size="small"
        color="primary"
      >
        <ToggleButton value="all">All Events</ToggleButton>
        <ToggleButton value="nearby" disabled={locating}>
          <NearMeIcon sx={{ mr: 0.5, fontSize: 18 }} />
          Near Me
        </ToggleButton>
      </ToggleButtonGroup>

      {locationFilter.mode === 'nearby' && (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 110 }}>
            <InputLabel id="radius-label">Radius</InputLabel>
            <Select
              labelId="radius-label"
              label="Radius"
              value={locationFilter.radiusKm}
              onChange={handleRadiusChange}
            >
              {RADIUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            size="small"
            startIcon={locating ? <CircularProgress size={16} /> : <MyLocationIcon />}
            onClick={() => loadNearbyEvents()}
            disabled={locating}
          >
            Refresh
          </Button>
        </Stack>
      )}
    </Stack>
  )

  if (loading && !listings.length) {
    return (
      <Box>
        {filterBar}
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      </Box>
    )
  }

  return (
    <>
      <SectionHeader
        title="Available Food Events"
        subtitle={
          locationFilter.mode === 'nearby'
            ? `Events within ${locationFilter.radiusKm} km of your location`
            : 'Browse all available food events from donors'
        }
      />

      {filterBar}

      {locationError && (
        <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setLocationError('')}>
          {locationError}
        </Alert>
      )}

      {!listings.length ? (
        <EmptyState
          icon={<NearMeIcon sx={{ fontSize: 36 }} />}
          title={locationFilter.mode === 'nearby' ? 'No nearby events' : 'No events available'}
          description={
            locationFilter.mode === 'nearby'
              ? `No food events within ${locationFilter.radiusKm} km. Try a larger radius or view all events.`
              : 'No food events available right now. Check notifications for new donor events.'
          }
          actionLabel={locationFilter.mode === 'nearby' ? 'View All Events' : undefined}
          onAction={locationFilter.mode === 'nearby' ? loadAllEvents : undefined}
        />
      ) : (
        <Grid container spacing={2}>
          {listings.map((listing) => (
            <Grid key={listing.id} size={{ xs: 12, md: 6 }}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    sx={{ mb: 1 }}
                  >
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {listing.food_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {listing.organization_event_name}
                      </Typography>
                    </Box>
                    <Stack spacing={0.5} alignItems="flex-end">
                      <Chip
                        label={formatStatusLabel(listing.status)}
                        color={STATUS_COLORS[listing.status] || 'default'}
                        size="small"
                      />
                      {listing.distance_km != null && (
                        <Chip
                          icon={<NearMeIcon sx={{ fontSize: '14px !important' }} />}
                          label={formatDistance(listing.distance_km)}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </Stack>
                  </Stack>

                  <Typography variant="body1" sx={{ my: 1.5 }}>
                    <strong>{listing.remaining_quantity}</strong> {formatUnit(listing.quantity_unit)}{' '}
                    available
                    <Typography component="span" variant="body2" color="text.secondary">
                      {' '}(of {listing.quantity} total)
                    </Typography>
                  </Typography>

                  <Stack spacing={0.5}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <AccessTimeIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        Expires: {dayjs(listing.expires_at).format('DD MMM YYYY, hh:mm A')}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="flex-start" spacing={0.5}>
                      <LocationOnIcon fontSize="small" color="action" sx={{ mt: 0.2 }} />
                      <Box>
                        <Typography variant="body2">{listing.location.address}</Typography>
                        {listing.location.landmark && (
                          <Typography variant="caption" color="text.secondary">
                            {listing.location.landmark}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </Stack>

                  {listing.other_details && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                      {listing.other_details}
                    </Typography>
                  )}
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button variant="contained" onClick={() => handleRespond(listing)}>
                    Respond
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <EventRespondDialog
        listing={selectedListing}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onGoToProfile={onGoToProfile}
        profileComplete={profileComplete}
      />
    </>
  )
}

export default AvailableEventsList
