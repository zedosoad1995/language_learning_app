import { createSlice } from '@reduxjs/toolkit'

export const logInSlice = createSlice({
  name: 'login',
  initialState: {
    loggedIn: false
  },
  reducers: {
    logIn: state => {
      state.loggedIn = true
    },
    logOut: state => {
      state.loggedIn = false
    }
  }
})

// Action creators are generated for each case reducer function
export const { logIn, logOut } = logInSlice.actions

export default logInSlice.reducer
