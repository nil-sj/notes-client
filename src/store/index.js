import { configureStore } from '@reduxjs/toolkit'
import authReducer       from './authSlice'
import notesReducer      from './notesSlice'
import { categoriesApi } from './categoriesApi'

const store = configureStore({
  reducer: {
    auth:                    authReducer,
    notes:                   notesReducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(categoriesApi.middleware),
})

export default store