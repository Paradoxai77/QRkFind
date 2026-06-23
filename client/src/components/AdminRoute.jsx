import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center transition-colors duration-300" style={{ background: 'var(--bg-surface)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-lime/30 border-t-lime rounded-full animate-spin" />
          <p className="dark:text-white/50 text-dark/50 font-medium">Verifying admin credentials...</p>
        </div>
      </div>
    )
  }

  const isAdmin = user && (user.role === 'admin' || user.email === 'pratiknerpagar2@gmail.com')

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default AdminRoute
