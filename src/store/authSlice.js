import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { login as loginApi, register as registerApi, getMe } from '../api/authApi'

// ── async thunks ──────────────────────────────────────────────────

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await loginApi({ email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      return res.data.user
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const res = await registerApi({ name, email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      return res.data.user
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return rejectWithValue('No token')
      const res = await getMe()
      return res.data
    } catch (err) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return rejectWithValue(err.message)
    }
  }
)

// ── slice ─────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    null,
    loading: true,    // true on first load while we verify the token
    error:   null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      state.user    = null
      state.loading = false
      state.error   = null
    },
    clearAuthError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // loadUser
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user    = action.payload
        state.loading = false
        state.error   = null
      })
      .addCase(loadUser.rejected, (state) => {
        state.user    = null
        state.loading = false
      })

    // loginUser
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user    = action.payload
        state.loading = false
        state.error   = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload
      })

    // registerUser
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user    = action.payload
        state.loading = false
        state.error   = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload
      })
  },
})

export const { logout, clearAuthError } = authSlice.actions
export default authSlice.reducer