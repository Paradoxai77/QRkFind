import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import logo from '../assets/logo.png'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setError('')
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back! 👋')
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex transition-colors duration-300" style={{ background: 'var(--bg-surface)' }}>
      {/* Left panel — decorative (Positivus style) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative overflow-hidden border-r transition-colors" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-64 h-64 bg-lime/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-lime/5 rounded-full blur-3xl" />
          <div className="absolute top-10 right-10 w-48 h-48 rounded-full border border-white/5" />
          <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full border border-white/5" />
        </div>

        <div className="relative text-center">
          {/* Spinning star */}
          <div className="flex justify-center mb-8">
            <svg viewBox="0 0 24 24" fill="#B9FF66" className="w-16 h-16 animate-spin-slow">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
            </svg>
          </div>

          <Link to="/" className="flex items-center gap-3 justify-center mb-8">
            <img src={logo} alt="QRkFind Logo" className="w-12 h-12 rounded-2xl object-cover" />
            <span className="font-display text-3xl font-bold dark:text-white text-dark">QRkFind</span>
          </Link>

          <h1 className="font-display text-3xl font-bold dark:text-white text-dark mb-4">Welcome Back</h1>
          <p className="dark:text-white/40 text-dark/50 text-base max-w-xs mx-auto leading-relaxed mb-10">
            Your belongings are waiting. Sign in to manage your registered items and check alerts.
          </p>

          <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
            {['📱', '🔑', '🎒', '☂️', '💻', '⌚'].map(icon => (
              <div key={icon} className="bg-white/5 border border-white/8 rounded-2xl p-4 text-2xl text-center hover:bg-lime/10 hover:border-lime/20 transition-all duration-300 cursor-default">
                {icon}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 transition-colors" style={{ background: 'var(--bg-surface)' }}>
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <Link to="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
            <img src={logo} alt="QRkFind Logo" className="w-9 h-9 rounded-xl object-cover" />
            <span className="font-display text-xl font-bold dark:text-white text-dark">QRkFind</span>
          </Link>

          <div className="mb-8">
            <span className="section-tag mb-4 inline-block">Sign In</span>
            <h2 className="font-display text-3xl font-bold dark:text-white text-dark mb-2">Welcome back</h2>
            <p className="dark:text-white/40 text-dark/50">
              Don't have an account?{' '}
              <Link to="/register" className="text-lime-theme font-semibold hover:text-lime-dark transition-colors">
                Register here
              </Link>
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="flex items-center gap-2.5 bg-red-900/30 border border-red-800 text-red-400 rounded-xl px-4 py-3 mb-5 text-sm">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
            {/* Email */}
            <div>
              <label htmlFor="email" className="input-label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-white/30 text-dark/30" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="input-label mb-0">Password</label>
                <button type="button" className="text-xs text-lime-theme hover:text-lime-theme font-medium transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-white/30 text-dark/30" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  className="input pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 dark:text-white/30 text-dark/30 hover:text-lime-theme transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In <ArrowRight size={18} />
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
