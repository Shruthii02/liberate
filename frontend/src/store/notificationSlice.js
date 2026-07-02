import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/authApi'

const formatApiError = (error, fallback) => {
  const data = error.response?.data
  if (typeof data === 'object' && data !== null) {
    if (data.detail) return data.detail
    const messages = Object.entries(data).map(
      ([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`
    )
    return messages.join(' | ')
  }
  return fallback
}

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/notifications/')
      return data
    } catch (error) {
      return rejectWithValue(formatApiError(error, 'Failed to load notifications.'))
    }
  }
)

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/notifications/unread-count/')
      return data.unread_count
    } catch (error) {
      return rejectWithValue(formatApiError(error, 'Failed to load unread count.'))
    }
  }
)

export const markNotificationRead = createAsyncThunk(
  'notifications/markNotificationRead',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/notifications/${id}/read/`)
      return data
    } catch (error) {
      return rejectWithValue(formatApiError(error, 'Failed to mark notification as read.'))
    }
  }
)

export const markAllNotificationsRead = createAsyncThunk(
  'notifications/markAllNotificationsRead',
  async (_, { rejectWithValue }) => {
    try {
      await api.patch('/notifications/read-all/')
      return true
    } catch (error) {
      return rejectWithValue(formatApiError(error, 'Failed to mark all as read.'))
    }
  }
)

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearNotificationError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.notifications = action.payload
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.map((n) =>
          n.id === action.payload.id ? action.payload : n
        )
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({ ...n, is_read: true }))
        state.unreadCount = 0
      })
  },
})

export const { clearNotificationError } = notificationSlice.actions
export default notificationSlice.reducer
