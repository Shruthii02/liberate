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

export const fetchAvailableListings = createAsyncThunk(
  'receiver/fetchAvailableListings',
  async ({ lat, lng, radius_km } = {}, { rejectWithValue }) => {
    try {
      const params = {}
      if (lat != null && lng != null) {
        params.lat = lat
        params.lng = lng
        params.radius_km = radius_km ?? 10
      }
      const { data } = await api.get('/food/listings/available/', { params })
      return { listings: data, filter: { lat, lng, radius_km: params.radius_km } }
    } catch (error) {
      return rejectWithValue(formatApiError(error, 'Failed to load available events.'))
    }
  }
)

export const respondToListing = createAsyncThunk(
  'receiver/respondToListing',
  async ({ id, response, accepted_quantity }, { rejectWithValue }) => {
    try {
      const payload = { response }
      if (response === 'ACCEPTED') {
        payload.accepted_quantity = accepted_quantity
      }
      const { data } = await api.post(`/food/listings/${id}/respond/`, payload)
      return { listingId: id, claim: data }
    } catch (error) {
      return rejectWithValue(formatApiError(error, 'Failed to respond to event.'))
    }
  }
)

export const fetchReceiverProfile = createAsyncThunk(
  'receiver/fetchReceiverProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/auth/receiver-profile/')
      return data
    } catch (error) {
      if (error.response?.status === 404) {
        return null
      }
      return rejectWithValue(formatApiError(error, 'Failed to load profile.'))
    }
  }
)

export const saveReceiverProfile = createAsyncThunk(
  'receiver/saveReceiverProfile',
  async (formData, { rejectWithValue, getState }) => {
    try {
      const hasProfile = Boolean(getState().receiver.profile)
      const { data } = hasProfile
        ? await api.patch('/auth/receiver-profile/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
        : await api.post('/auth/receiver-profile/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
      return data
    } catch (error) {
      return rejectWithValue(formatApiError(error, 'Failed to save profile.'))
    }
  }
)

const receiverSlice = createSlice({
  name: 'receiver',
  initialState: {
    availableListings: [],
    profile: null,
    acceptedCount: 0,
    loading: false,
    responding: false,
    profileLoading: false,
    profileSaving: false,
    error: null,
    successMessage: null,
    locationFilter: {
      mode: 'all',
      radiusKm: 10,
      lat: null,
      lng: null,
    },
  },
  reducers: {
    clearReceiverMessages: (state) => {
      state.error = null
      state.successMessage = null
    },
    setLocationRadius: (state, action) => {
      state.locationFilter.radiusKm = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableListings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAvailableListings.fulfilled, (state, action) => {
        state.loading = false
        state.availableListings = action.payload.listings
        const { lat, lng, radius_km } = action.payload.filter
        if (lat != null && lng != null) {
          state.locationFilter.mode = 'nearby'
          state.locationFilter.lat = lat
          state.locationFilter.lng = lng
          state.locationFilter.radiusKm = radius_km ?? state.locationFilter.radiusKm
        } else {
          state.locationFilter.mode = 'all'
        }
      })
      .addCase(fetchAvailableListings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(respondToListing.pending, (state) => {
        state.responding = true
        state.error = null
        state.successMessage = null
      })
      .addCase(respondToListing.fulfilled, (state, action) => {
        state.responding = false
        const { listingId, claim } = action.payload
        state.availableListings = state.availableListings.filter((l) => l.id !== listingId)
        if (claim.response === 'ACCEPTED') {
          state.acceptedCount += 1
          state.successMessage = `Successfully accepted ${claim.accepted_quantity} units.`
        } else {
          state.successMessage = 'Event rejected successfully.'
        }
      })
      .addCase(respondToListing.rejected, (state, action) => {
        state.responding = false
        state.error = action.payload
      })
      .addCase(fetchReceiverProfile.pending, (state) => {
        state.profileLoading = true
      })
      .addCase(fetchReceiverProfile.fulfilled, (state, action) => {
        state.profileLoading = false
        state.profile = action.payload
      })
      .addCase(fetchReceiverProfile.rejected, (state, action) => {
        state.profileLoading = false
        state.error = action.payload
      })
      .addCase(saveReceiverProfile.pending, (state) => {
        state.profileSaving = true
        state.error = null
      })
      .addCase(saveReceiverProfile.fulfilled, (state, action) => {
        state.profileSaving = false
        state.profile = action.payload
        state.successMessage = 'Profile saved successfully. You can now accept events.'
      })
      .addCase(saveReceiverProfile.rejected, (state, action) => {
        state.profileSaving = false
        state.error = action.payload
      })
  },
})

export const { clearReceiverMessages, setLocationRadius } = receiverSlice.actions
export default receiverSlice.reducer
