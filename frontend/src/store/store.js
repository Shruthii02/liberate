import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import foodReducer from './foodSlice'
import notificationReducer from './notificationSlice'
import receiverReducer from './receiverSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    food: foodReducer,
    notifications: notificationReducer,
    receiver: receiverReducer,
  },
})

export default store
