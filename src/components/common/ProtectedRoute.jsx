import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()

  // wait for auth to initialise before deciding
  if (loading) return <div>Loading...</div>

  if (!user) return <Navigate to="/login" replace />

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute