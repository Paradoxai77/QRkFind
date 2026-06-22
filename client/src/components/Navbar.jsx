import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { Bell, Menu, X, LogOut, LayoutDashboard, Plus, Scan } from 'lucide-react'

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
    `font-medium text-sm transition-colors px-3 py-2 rounded-lg nav-link-hover ${
      isActive
        ? 'text-lime'
        : 'text-white/70 hover:text-lime'
    }`

  return (
    <header className="sticky top-0 z-40 bg-dark/90 backdrop-blur-md border-b border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 font-display group">
            <div className="w-9 h-9 bg-lime rounded-xl flex items-center justify-center text-dark shadow-lime-glow group-hover:shadow-none transition-all">
              <Scan size={20} />
            </div>
            <span className="text-xl font-bold text-white group-hover:text-lime transition-colors">
              Find<span className="text-lime group-hover:text-white transition-colors">It</span>
            </span>
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
                    <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-lime text-dark text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </span>
              </NavLink>
            </nav>
          ) : (
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/login" className="text-sm font-medium text-white/70 hover:text-lime transition-colors nav-link-hover">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-5 rounded-xl">
                Request a quote
              </Link>
            </nav>
          )}

          {/* User menu (desktop) */}
          {user && (
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                <div className="w-7 h-7 bg-lime rounded-full flex items-center justify-center text-dark text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-white max-w-[100px] truncate">
                  {user.name}
                </span>
              </div>
              <button onClick={handleLogout} className="btn-ghost text-sm py-2 px-3 text-red-400 hover:bg-red-900/20 hover:text-red-400">
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-xl text-white/70 hover:bg-white/10 hover:text-lime transition-colors"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-dark border-t border-white/8 px-4 py-4 space-y-1 animate-fade-in">
          {user ? (
            <>
              <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-white/8">
                <div className="w-8 h-8 bg-lime rounded-full flex items-center justify-center text-dark font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-white">{user.name}</span>
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
                className="w-full text-left px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 rounded-lg transition-colors mt-2"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-3 py-2 text-sm font-medium text-white/70 hover:text-lime hover:bg-white/5 rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
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
