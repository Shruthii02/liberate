import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { saveReceiverProfile } from '../../store/receiverSlice'

function ReceiverProfileForm() {
  const dispatch = useDispatch()
  const { profile, profileLoading, profileSaving, error } = useSelector((state) => state.receiver)
  const [formData, setFormData] = useState({
    full_name: '',
    organization_name: '',
  })
  const [idCardFile, setIdCardFile] = useState(null)
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        organization_name: profile.organization_name || '',
      })
    }
  }, [profile])

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }))
    setValidationError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setValidationError('')

    if (!formData.full_name.trim()) {
      setValidationError('Full name is required.')
      return
    }
    if (!formData.organization_name.trim()) {
      setValidationError('Organization name is required.')
      return
    }
    if (!idCardFile && !profile?.id_card) {
      setValidationError('Please upload a valid ID card.')
      return
    }

    const data = new FormData()
    data.append('full_name', formData.full_name.trim())
    data.append('organization_name', formData.organization_name.trim())
    if (idCardFile) {
      data.append('id_card', idCardFile)
    }

    dispatch(saveReceiverProfile(data))
  }

  if (profileLoading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  const isComplete = profile?.is_complete

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <Typography variant="h6">Receiver Verification Profile</Typography>
        {isComplete ? (
          <Chip label="Verified" color="success" size="small" />
        ) : (
          <Chip label="Incomplete" color="warning" size="small" />
        )}
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide your details and upload a valid ID card. This is required before you can accept food events.
      </Typography>

      {(error || validationError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {validationError || error}
        </Alert>
      )}

      <Stack spacing={2} maxWidth={480}>
        <TextField
          required
          fullWidth
          label="Full Name"
          value={formData.full_name}
          onChange={handleChange('full_name')}
        />
        <TextField
          required
          fullWidth
          label="Organization Name"
          value={formData.organization_name}
          onChange={handleChange('organization_name')}
        />

        <Box>
          <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
            Upload ID Card
            <input
              type="file"
              hidden
              accept="image/*,.pdf"
              onChange={(e) => setIdCardFile(e.target.files?.[0] || null)}
            />
          </Button>
          {idCardFile && (
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Selected: {idCardFile.name}
            </Typography>
          )}
          {profile?.id_card_url && !idCardFile && (
            <Typography variant="caption" display="block" sx={{ mt: 1 }} color="success.main">
              ID card already uploaded
            </Typography>
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={profileSaving}
          sx={{ alignSelf: 'flex-start', minWidth: 160 }}
        >
          {profileSaving ? <CircularProgress size={24} color="inherit" /> : 'Save Profile'}
        </Button>
      </Stack>
    </Box>
  )
}

export default ReceiverProfileForm
