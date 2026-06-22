import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Verifying admin credentials...</p>
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
