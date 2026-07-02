import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import dayjs from 'dayjs'
import EventRespondDialog from './EventRespondDialog'
import { STATUS_COLORS, formatStatusLabel, formatUnit } from '../donor/listingConstants'

function AvailableEventsList({ listings, loading, profileComplete, onGoToProfile }) {
  const [selectedListing, setSelectedListing] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleRespond = (listing) => {
    setSelectedListing(listing)
    setDialogOpen(true)
  }

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!listings.length) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No available events right now. Check back later or view your notifications.
        </Typography>
      </Box>
    )
  }

  return (
    <>
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
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {listing.food_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {listing.organization_event_name}
                    </Typography>
                  </Box>
                  <Chip
                    label={formatStatusLabel(listing.status)}
                    color={STATUS_COLORS[listing.status] || 'default'}
                    size="small"
                  />
                </Stack>

                <Typography variant="body1" sx={{ my: 1.5 }}>
                  <strong>{listing.remaining_quantity}</strong> {formatUnit(listing.quantity_unit)} available
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
