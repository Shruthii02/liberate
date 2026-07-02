import { useState } from 'react'
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import dayjs from 'dayjs'
import EditListingDialog from './EditListingDialog'
import { STATUS_COLORS, formatStatusLabel, formatUnit } from './listingConstants'

function MyListingsTable({ listings, loading, embedded = false }) {
  const [selectedListing, setSelectedListing] = useState(null)
  const [editOpen, setEditOpen] = useState(false)

  const handleEdit = (listing) => {
    setSelectedListing(listing)
    setEditOpen(true)
  }

  const handleCloseEdit = () => {
    setEditOpen(false)
    setSelectedListing(null)
  }

  const canEdit = (listing) => ['AVAILABLE', 'CANCELLED'].includes(listing.status)

  const wrapContent = (content) =>
    embedded ? content : <Paper elevation={2}>{content}</Paper>

  if (loading) {
    return wrapContent(
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!listings.length) {
    return wrapContent(
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No listings yet. Create your first food listing in the Register Event tab.
        </Typography>
      </Box>
    )
  }

  const tableContent = (
    <Box sx={embedded ? undefined : { p: { xs: 2, md: 3 } }}>
      {!embedded && (
        <>
          <Typography variant="h6" gutterBottom>
            My Listings
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            All food events you have created.
          </Typography>
        </>
      )}

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Event</TableCell>
              <TableCell>Food</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Expires At</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listings.map((listing) => (
              <TableRow key={listing.id} hover>
                <TableCell>{listing.organization_event_name}</TableCell>
                <TableCell>{listing.food_name}</TableCell>
                <TableCell>
                  {listing.quantity} {formatUnit(listing.quantity_unit)}
                </TableCell>
                <TableCell>
                  {dayjs(listing.expires_at).format('DD MMM YYYY, hh:mm A')}
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{listing.location.address}</Typography>
                    {listing.location.landmark && (
                      <Typography variant="caption" color="text.secondary">
                        {listing.location.landmark}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={formatStatusLabel(listing.status)}
                    color={STATUS_COLORS[listing.status] || 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  {canEdit(listing) ? (
                    <Tooltip title="Edit listing">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(listing)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      Locked
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )

  return (
    <>
      {embedded ? tableContent : <Paper elevation={2}>{tableContent}</Paper>}

      <EditListingDialog
        listing={selectedListing}
        open={editOpen}
        onClose={handleCloseEdit}
      />
    </>
  )
}

export default MyListingsTable
