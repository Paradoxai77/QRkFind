import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { Bell, Menu, X, LogOut, LayoutDashboard, Plus } from 'lucide-react'

const Navbar = ({ unreadCount = 0 }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileOpen(false)
  }

  const navLinkClass = ({ isActive }) =>
    `font-medium text-sm transition-colors px-3 py-2 rounded-lg ${
      isActive
        ? 'text-primary-600 bg-primary-50'
        : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
    }`

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 font-display">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-blue-400 rounded-lg flex items-center justify-center text-white text-lg shadow-md">
              🔍
            </div>
            <span className="text-xl font-extrabold gradient-text">FindIt</span>
          </Link>

          {/* Desktop nav */}
          {user ? (
            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/dashboard" className={navLinkClass} end>
                <span className="flex items-center gap-1.5">
                  <LayoutDashboard size={15} /> Dashboard
                </span>
              </NavLink>
              <NavLink to="/dashboard/add-item" className={navLinkClass}>
                <span className="flex items-center gap-1.5">
                  <Plus size={15} /> Add Item
                </span>
              </NavLink>
              <NavLink to="/dashboard/notifications" className={navLinkClass}>
                <span className="flex items-center gap-1.5 relative">
                  <Bell size={15} />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </span>
              </NavLink>
            </nav>
          ) : (
            <nav className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-5">
                Get Started
              </Link>
            </nav>
          )}

          {/* User menu (desktop) */}
          {user && (
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3 py-2">
                <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-blue-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-slate-700 max-w-[100px] truncate">
                  {user.name}
                </span>
              </div>
              <button onClick={handleLogout} className="btn-ghost text-sm py-2 px-3 text-red-500 hover:bg-red-50 hover:text-red-600">
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-1 animate-fade-in">
          {user ? (
            <>
              <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-slate-800">{user.name}</span>
              </div>
              <NavLink to="/dashboard" className={navLinkClass} end onClick={() => setMobileOpen(false)}>
                Dashboard
              </NavLink>
              <NavLink to="/dashboard/add-item" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                + Add Item
              </NavLink>
              <NavLink to="/dashboard/notifications" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                Notifications {unreadCount > 0 && `(${unreadCount})`}
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-2"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg" onClick={() => setMobileOpen(false)}>
                Sign In
              </Link>
              <Link to="/register" className="block btn-primary text-center text-sm mt-2" onClick={() => setMobileOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}

export default Navbar
