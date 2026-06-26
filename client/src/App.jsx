import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AddItem from './pages/AddItem'
import ItemDetail from './pages/ItemDetail'
import FoundPage from './pages/FoundPage'
import Notifications from './pages/Notifications'
import AdminDashboard from './pages/AdminDashboard'
import AdminRoute from './components/AdminRoute'
import DotGrid from './components/DotGrid'
import { useTheme } from './context/ThemeContext'

const App = () => {
  const { theme } = useTheme()

  return (
    <>
      <DotGrid activeColor="#38c826" baseColor={theme === 'dark' ? '#313244' : '#d0d1c9'} />
      <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/found/:itemId" element={<FoundPage />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/add-item"
        element={
          <ProtectedRoute>
            <AddItem />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/item/:id"
        element={
          <ProtectedRoute>
            <ItemDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* 404 catch-all */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 transition-colors duration-300" style={{ background: 'var(--bg-surface)' }}>
            <div className="text-7xl mb-4">🔍</div>
            <h1 className="font-display text-4xl font-extrabold dark:text-white text-dark mb-2">Page Not Found</h1>
            <p className="dark:text-white/60 text-dark/60 mb-6">The page you're looking for doesn't exist.</p>
            <a href="/" className="btn-primary">Go Home</a>
          </div>
        }
      />
      </Routes>
    </>
  )
}

export default App
