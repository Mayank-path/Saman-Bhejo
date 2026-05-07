
import { createSlice } from "@reduxjs/toolkit"
import type {  PayloadAction } from "@reduxjs/toolkit"
import type { User } from "../../types"

interface AuthState {
  user:         User | null
  accessToken:  string | null
  refreshToken: string | null
  isLoading:    boolean
}

const initialState: AuthState = {
  user:         null,
  accessToken:  localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  isLoading:    false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User, tokens: { accessToken: string, refreshToken: string } }>) => {
      state.user         = action.payload.user
      state.accessToken  = action.payload.tokens.accessToken
      state.refreshToken = action.payload.tokens.refreshToken
      localStorage.setItem("accessToken",  action.payload.tokens.accessToken)
      localStorage.setItem("refreshToken", action.payload.tokens.refreshToken)
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },

    logout: (state) => {
      state.user         = null
      state.accessToken  = null
      state.refreshToken = null
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { setCredentials, setUser, logout, setLoading } = authSlice.actions
export default authSlice.reducer