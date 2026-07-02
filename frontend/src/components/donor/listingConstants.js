export const QUANTITY_UNITS = [
  { value: 'PLATES', label: 'Plates' },
  { value: 'KG', label: 'Kg' },
  { value: 'BOXES', label: 'Boxes' },
  { value: 'PACKETS', label: 'Packets' },
  { value: 'LITERS', label: 'Liters' },
  { value: 'OTHER', label: 'Other' },
]

export const LISTING_STATUS_OPTIONS = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'CANCELLED', label: 'Not Available' },
]

export const STATUS_COLORS = {
  AVAILABLE: 'success',
  PARTIALLY_CLAIMED: 'warning',
  CANCELLED: 'default',
  CLAIMED: 'info',
  EXPIRED: 'warning',
}

export const formatStatusLabel = (status) => {
  const labels = {
    AVAILABLE: 'Available',
    PARTIALLY_CLAIMED: 'Partially Claimed',
    CANCELLED: 'Not Available',
    CLAIMED: 'Claimed',
    EXPIRED: 'Expired',
  }
  if (labels[status]) return labels[status]
  const match = LISTING_STATUS_OPTIONS.find((option) => option.value === status)
  if (match) return match.label
  return status.charAt(0) + status.slice(1).toLowerCase()
}

export const formatUnit = (unit) => unit.charAt(0) + unit.slice(1).toLowerCase()
