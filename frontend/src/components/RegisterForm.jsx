import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { clearAuthMessages, registerUser } from '../store/authSlice'

const ROLES = [
  { value: 'DONOR', label: 'Donor' },
  { value: 'RECEIVER', label: 'Receiver' },
]

function RegisterForm({ onSwitchToLogin }) {
  const dispatch = useDispatch()
  const { loading, error, successMessage } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'DONOR',
    phone: '',
    email: '',
    first_name: '',
    last_name: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [validationError, setValidationError] = useState('')

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }))
    setValidationError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(clearAuthMessages())
    setValidationError('')

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match.')
      return
    }

    if (formData.password.length < 8) {
      setValidationError('Password must be at least 8 characters.')
      return
    }

    const payload = {
      username: formData.username,
      password: formData.password,
      role: formData.role,
      phone: formData.phone,
    }

    if (formData.email) payload.email = formData.email
    if (formData.first_name) payload.first_name = formData.first_name
    if (formData.last_name) payload.last_name = formData.last_name

    dispatch(registerUser(payload))
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {(error || validationError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {validationError || error}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <TextField
        margin="normal"
        required
        fullWidth
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
        value={formData.username}
        onChange={handleChange('username')}
      />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          margin="normal"
          fullWidth
          label="First Name"
          name="first_name"
          autoComplete="given-name"
          value={formData.first_name}
          onChange={handleChange('first_name')}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Last Name"
          name="last_name"
          autoComplete="family-name"
          value={formData.last_name}
          onChange={handleChange('last_name')}
        />
      </Box>

      <TextField
        margin="normal"
        fullWidth
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        value={formData.email}
        onChange={handleChange('email')}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        label="Phone"
        name="phone"
        autoComplete="tel"
        value={formData.phone}
        onChange={handleChange('phone')}
      />

      <FormControl fullWidth margin="normal" required>
        <InputLabel id="role-label">Role</InputLabel>
        <Select
          labelId="role-label"
          id="role"
          value={formData.role}
          label="Role"
          onChange={handleChange('role')}
        >
          {ROLES.map((role) => (
            <MenuItem key={role.value} value={role.value}>
              {role.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="new-password"
        value={formData.password}
        onChange={handleChange('password')}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword((prev) => !prev)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label="Confirm Password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="new-password"
        value={formData.confirmPassword}
        onChange={handleChange('confirmPassword')}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        sx={{ mt: 3, mb: 2, py: 1.4 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
      </Button>

      <Button
        fullWidth
        variant="text"
        onClick={onSwitchToLogin}
        sx={{ color: 'text.secondary' }}
      >
        Already have an account? Sign in
      </Button>
    </Box>
  )
}

export default RegisterForm
