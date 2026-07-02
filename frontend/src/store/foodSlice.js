import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/authApi'

const formatApiError = (error, fallback) => {
  const data = error.response?.data
  if (typeof data === 'object' && data !== null) {
    const messages = Object.entries(data).map(
      ([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`
    )
    return messages.join(' | ')
  }
  return fallback
}

export const fetchMyListings = createAsyncThunk(
  'food/fetchMyListings',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/food/listings/mine/')
      return data
    } catch (error) {
      return rejectWithValue(formatApiError(error, 'Failed to load your listings.'))
    }
  }
)

export const createListing = createAsyncThunk(
  'food/createListing',
  async (listingData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/food/listings/', listingData)
      return data
    } catch (error) {
      return rejectWithValue(formatApiError(error, 'Failed to create listing.'))
    }
  }
)

export const updateListing = createAsyncThunk(
  'food/updateListing',
  async ({ id, listingData }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/food/listings/${id}/`, listingData)
      return data
    } catch (error) {
      return rejectWithValue(formatApiError(error, 'Failed to update listing.'))
    }
  }
)

const foodSlice = createSlice({
  name: 'food',
  initialState: {
    listings: [],
    loading: false,
    creating: false,
    updating: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearFoodMessages: (state) => {
      state.error = null
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyListings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyListings.fulfilled, (state, action) => {
        state.loading = false
        state.listings = action.payload
      })
      .addCase(fetchMyListings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createListing.pending, (state) => {
        state.creating = true
        state.error = null
        state.successMessage = null
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.creating = false
        state.successMessage = 'Food listing created successfully.'
        state.listings = [action.payload, ...state.listings]
      })
      .addCase(createListing.rejected, (state, action) => {
        state.creating = false
        state.error = action.payload
      })
      .addCase(updateListing.pending, (state) => {
        state.updating = true
        state.error = null
        state.successMessage = null
      })
      .addCase(updateListing.fulfilled, (state, action) => {
        state.updating = false
        state.successMessage = 'Listing updated successfully.'
        state.listings = state.listings.map((listing) =>
          listing.id === action.payload.id ? action.payload : listing
        )
      })
      .addCase(updateListing.rejected, (state, action) => {
        state.updating = false
        state.error = action.payload
      })
  },
})

export const { clearFoodMessages } = foodSlice.actions
export default foodSlice.reducer
