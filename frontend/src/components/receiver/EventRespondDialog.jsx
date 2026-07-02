import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { respondToListing } from '../../store/receiverSlice'
import { formatUnit } from '../donor/listingConstants'

function EventRespondDialog({ listing, open, onClose, onGoToProfile, profileComplete }) {
  const dispatch = useDispatch()
  const { responding, error } = useSelector((state) => state.receiver)
  const [partialQty, setPartialQty] = useState('')
  const [validationError, setValidationError] = useState('')
  const [confirmReject, setConfirmReject] = useState(false)

  if (!listing) return null

  const handleClose = () => {
    setPartialQty('')
    setValidationError('')
    setConfirmReject(false)
    onClose()
  }

  const handleAcceptFull = () => {
    if (!profileComplete) return
    dispatch(
      respondToListing({
        id: listing.id,
        response: 'ACCEPTED',
        accepted_quantity: listing.remaining_quantity,
      })
    ).then((result) => {
      if (!result.error) handleClose()
    })
  }

  const handleAcceptPartial = () => {
    if (!profileComplete) return
    setValidationError('')
    const qty = Number(partialQty)
    if (!qty || qty <= 0) {
      setValidationError('Enter a valid quantity greater than 0.')
      return
    }
    if (qty > listing.remaining_quantity) {
      setValidationError(`Cannot accept more than ${listing.remaining_quantity} ${formatUnit(listing.quantity_unit)}.`)
      return
    }
    dispatch(
      respondToListing({
        id: listing.id,
        response: 'ACCEPTED',
        accepted_quantity: qty,
      })
    ).then((result) => {
      if (!result.error) handleClose()
    })
  }

  const handleReject = () => {
    dispatch(respondToListing({ id: listing.id, response: 'REJECTED' })).then((result) => {
      if (!result.error) handleClose()
    })
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Respond to Event</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {listing.food_name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {listing.organization_event_name}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Available: <strong>{listing.remaining_quantity} {formatUnit(listing.quantity_unit)}</strong>
        </Typography>

        {!profileComplete && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Complete your profile (name, organization, ID card) in the My Profile tab before accepting.
            <Button size="small" onClick={onGoToProfile} sx={{ ml: 1 }}>
              Go to Profile
            </Button>
          </Alert>
        )}

        {(error || validationError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {validationError || error}
          </Alert>
        )}

        {confirmReject ? (
          <Alert severity="info">
            Are you sure you want to reject this event? You won&apos;t see it again.
          </Alert>
        ) : (
          <Stack spacing={2}>
            <Divider />
            <Typography variant="subtitle2">Accept Partial Quantity</Typography>
            <TextField
              fullWidth
              type="number"
              label={`Quantity (${formatUnit(listing.quantity_unit)})`}
              value={partialQty}
              onChange={(e) => setPartialQty(e.target.value)}
              inputProps={{ min: 1, max: listing.remaining_quantity }}
              disabled={!profileComplete || responding}
            />
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, flexWrap: 'wrap', gap: 1 }}>
        <Button onClick={handleClose} disabled={responding}>
          Cancel
        </Button>
        {confirmReject ? (
          <>
            <Button onClick={() => setConfirmReject(false)} disabled={responding}>
              Back
            </Button>
            <Button color="error" variant="contained" onClick={handleReject} disabled={responding}>
              {responding ? <CircularProgress size={22} color="inherit" /> : 'Confirm Reject'}
            </Button>
          </>
        ) : (
          <>
            <Button color="error" variant="outlined" onClick={() => setConfirmReject(true)} disabled={responding}>
              Reject
            </Button>
            <Button
              variant="outlined"
              onClick={handleAcceptPartial}
              disabled={!profileComplete || responding || !partialQty}
            >
              Accept Partial
            </Button>
            <Button
              variant="contained"
              onClick={handleAcceptFull}
              disabled={!profileComplete || responding}
            >
              {responding ? <CircularProgress size={22} color="inherit" /> : `Accept Full (${listing.remaining_quantity})`}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default EventRespondDialog
