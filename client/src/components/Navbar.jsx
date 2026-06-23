import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useState } from 'react'
import { Bell, Menu, X, LogOut, LayoutDashboard, Plus, Sun, Moon } from 'lucide-react'
import logo from '../assets/logo.png'

const Navbar = ({ unreadCount = 0 }) => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
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
        ? 'text-lime-theme'
        : 'dark:text-white/70 dark:hover:text-lime-theme text-dark/60 hover:text-lime-theme'
    }`

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300" style={{ background: 'var(--bg-nav)', borderColor: 'var(--border-color)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 font-display group">
            <img src={logo} alt="QRkFind Logo" className="w-9 h-9 rounded-xl object-cover shadow-lime-glow group-hover:shadow-none transition-all" />
            <span className="text-xl font-bold dark:text-white text-dark group-hover:text-lime-theme transition-colors">
              QRk<span className="text-lime-theme group-hover:text-dark dark:group-hover:text-white transition-colors">Find</span>
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
              {user && (user.role === 'admin' || user.email === 'pratiknerpagar2@gmail.com') && (
                <NavLink to="/admin" className={navLinkClass}>
                  <span className="flex items-center gap-1.5 font-bold text-red-400">
                    🛡️ Admin Panel
                  </span>
                </NavLink>
              )}
            </nav>
          ) : (
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/login" className="text-sm font-medium dark:text-white/70 text-dark/70 hover:text-lime-theme transition-colors nav-link-hover">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-5 rounded-xl">
                Request a quote
              </Link>
            </nav>
          )}

          {/* Theme toggle + User menu (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {user && (
              <>
                <div className="flex items-center gap-2.5 rounded-xl px-3 py-2 border transition-colors" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                  <div className="w-7 h-7 bg-lime rounded-full flex items-center justify-center text-dark text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold dark:text-white text-dark max-w-[100px] truncate">
                    {user.name}
                  </span>
                </div>
                <button onClick={handleLogout} className="btn-ghost text-sm py-2 px-3 text-red-400 hover:bg-red-900/20 hover:text-red-400">
                  <LogOut size={15} />
                  Sign Out
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              className="p-2 rounded-xl dark:text-white/70 text-dark/60 hover:bg-lime-theme-light hover:text-lime-theme transition-colors"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t transition-colors duration-300 px-4 py-4 space-y-1 animate-fade-in" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
          {user ? (
            <>
              <div className="flex items-center gap-2.5 mb-3 pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <div className="w-8 h-8 bg-lime rounded-full flex items-center justify-center text-dark font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold dark:text-white text-dark">{user.name}</span>
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
              {user && (user.role === 'admin' || user.email === 'pratiknerpagar2@gmail.com') && (
                <NavLink to="/admin" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                  🛡️ Admin Panel
                </NavLink>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 rounded-lg transition-colors mt-2"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-3 py-2 text-sm font-medium dark:text-white/70 text-dark/60 hover:text-lime-theme hover:bg-lime-theme-light rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
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
