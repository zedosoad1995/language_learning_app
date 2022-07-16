import { configureStore } from '@reduxjs/toolkit'
import logInReducer from './slices/login'


export default configureStore({
  reducer: {
    login: logInReducer
  }
})