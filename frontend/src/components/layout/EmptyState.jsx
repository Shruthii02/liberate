import { Box, Button, Typography } from '@mui/material'

function EmptyState({ icon, title, description, actionLabel, onAction }) {
  return (
    <Box sx={{ py: 6, px: 3, textAlign: 'center' }}>
      {icon && (
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            bgcolor: 'grey.100',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.disabled',
            mx: 'auto',
            mb: 2,
          }}
        >
          {icon}
        </Box>
      )}
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mx: 'auto', mb: 2 }}>
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  )
}

export default EmptyState
