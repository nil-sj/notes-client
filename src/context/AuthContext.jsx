import { createContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loadUser } from '../store/authSlice'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const dispatch = useDispatch()

  // verify token on first load
  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])

  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  )
}