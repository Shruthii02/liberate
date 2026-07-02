import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/authApi'

const persistUser = (user) => {
  localStorage.setItem('username', user.username)
  localStorage.setItem('userRole', user.role)
}

const clearPersistedUser = () => {
  localStorage.removeItem('username')
  localStorage.removeItem('userRole')
}

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/auth/me/')
      persistUser(data)
      return data
    } catch (error) {
      return rejectWithValue('Failed to load user profile.')
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login/', { username, password })
      localStorage.setItem('accessToken', data.access)
      localStorage.setItem('refreshToken', data.refresh)

      const { data: user } = await api.get('/auth/me/')
      persistUser(user)

      return { ...user, access: data.access, refresh: data.refresh }
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
      return { username: userData.username, role: userData.role }
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
  clearPersistedUser()
})

const storedUsername = localStorage.getItem('username')
const storedRole = localStorage.getItem('userRole')

const initialState = {
  user: localStorage.getItem('accessToken')
    ? {
        username: storedUsername || null,
        role: storedRole || null,
      }
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
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = {
          id: action.payload.id,
          username: action.payload.username,
          role: action.payload.role,
          email: action.payload.email,
          phone: action.payload.phone,
        }
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
        state.successMessage = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = {
          id: action.payload.id,
          username: action.payload.username,
          role: action.payload.role,
          email: action.payload.email,
          phone: action.payload.phone,
        }
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
      })
  },
})

export const { clearAuthMessages } = authSlice.actions
export default authSlice.reducer
