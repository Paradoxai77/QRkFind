import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import logo from '../assets/logo.png'

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setError('')
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const validate = () => {
    if (!form.name.trim()) return 'Please enter your full name.'
    if (!form.email.trim()) return 'Please enter your email address.'
    if (form.password.length < 6) return 'Password must be at least 6 characters.'
    if (form.password !== form.confirmPassword) return 'Passwords do not match.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }
    setError('')
    setLoading(true)
    try {
      await register(form.name.trim(), form.email.trim(), form.password)
      toast.success('Account created! Welcome to QRkFind 🎉')
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const passwordStrength = () => {
    const p = form.password
    if (!p) return null
    if (p.length < 6) return { level: 1, label: 'Too short', color: 'bg-red-400' }
    if (p.length < 8) return { level: 2, label: 'Weak', color: 'bg-warn-400' }
    if (p.length < 12) return { level: 3, label: 'Good', color: 'bg-blue-400' }
    return { level: 4, label: 'Strong', color: 'bg-lime' }
  }
  const strength = passwordStrength()

  return (
    <div className="min-h-screen flex transition-colors duration-300" style={{ background: 'var(--bg-surface)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-lime via-lime-dark to-emerald-600 flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-dark/10 rounded-full blur-3xl" />
        </div>
        <div className="relative text-center">
          <div className="text-7xl mb-6">🛡️</div>
          <h1 className="font-display text-4xl font-extrabold text-dark mb-4">Join QRkFind</h1>
          <p className="text-dark/60 text-lg max-w-xs mx-auto leading-relaxed">
            Register for free and start protecting your valuables with smart QR codes.
          </p>
          <div className="mt-10 space-y-3 text-left">
            {[
              'Generate unlimited QR codes',
              'Instant email notifications',
              'GPS location of finder',
              '100% private — no data sold',
            ].map(f => (
              <div key={f} className="flex items-center gap-3 bg-dark/10 rounded-xl px-4 py-3">
                <CheckCircle size={16} className="text-dark flex-shrink-0" />
                <span className="text-dark text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 transition-colors" style={{ background: 'var(--bg-surface)' }}>
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <img src={logo} alt="QRkFind Logo" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-display text-2xl font-extrabold text-lime-theme">QRkFind</span>
          </Link>

          <span className="section-tag mb-4 inline-block">Create Account</span>
          <h2 className="font-display text-3xl font-extrabold dark:text-white text-dark mb-2">Create Account</h2>
          <p className="dark:text-white/40 text-dark/50 mb-8">
            Already have an account?{' '}
            <Link to="/login" className="text-lime-theme font-semibold hover:underline">Sign in</Link>
          </p>

          {error && (
            <div className="flex items-center gap-2.5 bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-5 text-sm">
              <AlertCircle size={16} className="flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" id="register-form">
            {/* Name */}
            <div>
              <label htmlFor="reg-name" className="input-label">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-white/30 text-dark/30" />
                <input id="reg-name" name="name" type="text" required autoComplete="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="input pl-10" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="input-label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-white/30 text-dark/30" />
                <input id="reg-email" name="email" type="email" required autoComplete="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="input pl-10" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="input-label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-white/30 text-dark/30" />
                <input id="reg-password" name="password" type={showPassword ? 'text' : 'password'} required autoComplete="new-password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" className="input pl-10 pr-10" />
                <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 dark:text-white/30 text-dark/30 hover:text-lime-theme transition-colors" aria-label="Toggle password visibility">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {strength && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength.level ? strength.color : 'dark:bg-white/10 bg-dark/10'}`} />
                    ))}
                  </div>
                  <p className="text-xs dark:text-white/40 text-dark/50 mt-1">{strength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="reg-confirm" className="input-label">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-white/30 text-dark/30" />
                <input
                  id="reg-confirm" name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required autoComplete="new-password"
                  value={form.confirmPassword} onChange={handleChange}
                  placeholder="Repeat your password"
                  className={`input pl-10 ${form.confirmPassword && form.password !== form.confirmPassword ? 'border-red-400 focus:ring-red-400' : ''}`}
                />
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <CheckCircle size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-lime" />
                )}
              </div>
            </div>

            <button type="submit" id="register-submit" disabled={loading} className="btn-primary w-full py-3.5 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create Account <ArrowRight size={18} />
                </span>
              )}
            </button>
          </form>

          <p className="text-xs dark:text-white/30 text-dark/40 mt-5 text-center">
            By registering, you agree to our Privacy Policy. We never sell your data.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
