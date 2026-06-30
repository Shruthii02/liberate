import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { clearAuthMessages, loginUser } from '../store/authSlice'

function LoginForm({ onSwitchToRegister }) {
  const dispatch = useDispatch()
  const { loading, error, successMessage } = useSelector((state) => state.auth)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(clearAuthMessages())
    dispatch(loginUser({ username, password }))
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
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

      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        sx={{ mt: 3, mb: 2, py: 1.4 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
      </Button>

      <Button
        fullWidth
        variant="text"
        onClick={onSwitchToRegister}
        sx={{ color: 'text.secondary' }}
      >
        New user? Create an account
      </Button>
    </Box>
  )
}

export default LoginForm
