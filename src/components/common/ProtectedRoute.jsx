import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Spinner from './Spinner'

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useSelector(state => state.auth)

  if (loading) return <Spinner />
  if (!user)   return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />

  return children
}

export default ProtectedRoute