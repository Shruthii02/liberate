import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import foodReducer from './foodSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    food: foodReducer,
  },
})

export default store
