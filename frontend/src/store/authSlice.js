import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/authApi'

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login/', { username, password })
      localStorage.setItem('accessToken', data.access)
      localStorage.setItem('refreshToken', data.refresh)
      return { username, access: data.access, refresh: data.refresh }
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.non_field_errors?.[0] ||
        'Login failed. Please check your credentials.'
      return rejectWithValue(message)
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      await api.post('/auth/register/', userData)
      return userData.username
    } catch (error) {
      const data = error.response?.data
      if (typeof data === 'object' && data !== null) {
        const messages = Object.entries(data).map(
          ([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`
        )
        return rejectWithValue(messages.join(' | '))
      }
      return rejectWithValue('Registration failed. Please try again.')
    }
  }
)

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
})

const initialState = {
  user: localStorage.getItem('accessToken')
    ? { username: localStorage.getItem('username') || null }
    : null,
  isAuthenticated: Boolean(localStorage.getItem('accessToken')),
  loading: false,
  error: null,
  successMessage: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthMessages: (state) => {
      state.error = null
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
        state.successMessage = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = { username: action.payload.username }
        localStorage.setItem('username', action.payload.username)
        state.successMessage = 'Welcome back!'
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
        state.successMessage = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false
        state.successMessage = 'Account created! You can sign in now.'
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.error = null
        state.successMessage = null
        localStorage.removeItem('username')
      })
  },
})

export const { clearAuthMessages } = authSlice.actions
export default authSlice.reducer
