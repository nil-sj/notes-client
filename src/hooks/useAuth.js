import { useDispatch, useSelector } from 'react-redux'
import { loginUser, registerUser, logout } from '../store/authSlice'

export function useAuth() {
  const dispatch = useDispatch()
  const { user, loading, error } = useSelector(state => state.auth)

  const login = (email, password) =>
    dispatch(loginUser({ email, password }))

  const register = (name, email, password) =>
    dispatch(registerUser({ name, email, password }))

  const logoutUser = () =>
    dispatch(logout())

  return { user, loading, error, login, register, logout: logoutUser }
}