import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../utils/api'
import { MapPin, Phone, Mail, MessageSquare, Send, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import { CATEGORY_ICONS } from '../components/QRCard'
import logo from '../assets/logo.png'

const FoundPage = () => {
  const { itemId } = useParams()
  const [item, setItem] = useState(null)
  const [loadingItem, setLoadingItem] = useState(true)
  const [itemError, setItemError] = useState('')

  const [form, setForm] = useState({
    finderName: '',
    finderPhone: '',
    finderEmail: '',
    message: '',
  })
  const [location, setLocation] = useState(null)
  const [gpsStatus, setGpsStatus] = useState('idle') // idle | loading | granted | denied
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Fetch public item info
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/api/found/${itemId}`)
        setItem(data.item)
      } catch (err) {
        setItemError(err.response?.data?.message || 'This QR code is invalid or the item no longer exists.')
      } finally {
        setLoadingItem(false)
      }
    }
    fetch()
  }, [itemId])

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleGPS = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.')
      return
    }
    setGpsStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setGpsStatus('granted')
        toast.success('📍 Location captured!')
      },
      () => {
        setGpsStatus('denied')
        toast.error('Location access denied. You can still submit without it.')
      },
      { timeout: 10000 }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.finderName.trim()) return toast.error('Please enter your name.')
    if (!form.finderPhone.trim()) return toast.error('Please enter your phone number.')

    setSubmitting(true)
    try {
      await api.post(`/api/found/${itemId}`, {
        finderName: form.finderName.trim(),
        finderPhone: form.finderPhone.trim(),
        finderEmail: form.finderEmail.trim() || null,
        message: form.message.trim(),
        location: location || null,
      })
      setSubmitted(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Loading ──
  if (loadingItem) {
    return (
      <div className="min-h-screen flex items-center justify-center transition-colors duration-300" style={{ background: 'var(--bg-surface)' }}>
        <div className="text-center">
          <Loader className="w-10 h-10 text-primary-500 animate-spin mx-auto mb-3" />
          <p className="dark:text-white/50 text-dark/50 font-medium">Loading item details...</p>
        </div>
      </div>
    )
  }

  // ── Error ──
  if (itemError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300" style={{ background: 'var(--bg-surface)' }}>
        <div className="rounded-2xl p-10 max-w-md text-center border transition-all duration-300 card-glow" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div className="text-6xl mb-4">❌</div>
          <h1 className="font-display text-2xl font-bold dark:text-white text-dark mb-2">QR Code Invalid</h1>
          <p className="dark:text-white/60 text-dark/60 mb-6">{itemError}</p>
          <Link to="/" className="btn-primary">
            Go to QRkFind
          </Link>
        </div>
      </div>
    )
  }

  // ── Success ──
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300" style={{ background: 'var(--bg-surface)' }}>
        <div className="rounded-2xl p-10 max-w-md text-center animate-slide-up border card-glow" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div className="w-20 h-20 bg-lime-theme-light rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-lime-theme" />
          </div>
          <h1 className="font-display text-3xl font-bold dark:text-white text-dark mb-3">Thank You! 🙌</h1>
          <p className="dark:text-white/70 text-dark/70 leading-relaxed mb-2">
            Your report has been submitted. The item's owner has been notified and will reach out to you soon.
          </p>
          <p className="text-sm dark:text-white/40 text-dark/45 mb-8">
            You're doing a great thing helping someone recover their lost item.
          </p>
          <div className="bg-lime-theme-light border border-lime-theme rounded-xl p-4 text-sm text-lime-theme font-medium">
            🏠 The owner will contact you at the phone number you provided.
          </div>
        </div>
      </div>
    )
  }

  // ── Form ──
  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: 'var(--bg-surface)' }}>
      {/* Header */}
      <header className="backdrop-blur-md border-b py-4 px-4 text-center transition-colors duration-300" style={{ background: 'var(--bg-nav)', borderColor: 'var(--border-color)' }}>
        <Link to="/" className="inline-flex items-center gap-2">
          <img src={logo} alt="QRkFind Logo" className="w-6 h-6 rounded-md object-cover" />
          <span className="font-display text-xl font-extrabold dark:text-white text-dark">
            QRk<span className="text-lime-theme">Find</span>
          </span>
        </Link>
      </header>

      <main className="max-w-lg mx-auto px-4 py-10">
        {/* Item banner */}
        <div className="rounded-2xl p-6 mb-8 text-center animate-slide-up border-t-4 border-lime-theme border transition-colors"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div className="text-5xl mb-3">{CATEGORY_ICONS[item.category] || '📦'}</div>
          <div className="inline-flex items-center gap-2 bg-lime-theme-light text-lime-theme text-xs font-bold px-3 py-1.5 rounded-full mb-3">
            You found something!
          </div>
          <h1 className="font-display text-2xl font-extrabold dark:text-white text-dark mb-1">{item.name}</h1>
          {item.description && (
            <p className="dark:text-white/60 text-dark/60 text-sm">{item.description}</p>
          )}
          <div className="mt-4 bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-400 rounded-xl p-3 text-xs font-medium">
            🔒 The owner's identity is private. Fill out the form below and they'll contact you directly.
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-2xl p-8 border transition-colors animate-slide-up" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', animationDelay: '0.1s' }}>
          <h2 className="font-display text-xl font-bold dark:text-white text-dark mb-1">Help Return This Item</h2>
          <p className="dark:text-white/60 text-dark/60 text-sm mb-6">
            Leave your contact details and the owner will reach out to you.
          </p>

          <form onSubmit={handleSubmit} id="found-form" className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="found-name" className="input-label">
                Your Name <span className="text-red-400">*</span>
              </label>
              <input
                id="found-name"
                name="finderName"
                type="text"
                required
                value={form.finderName}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="input"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="found-phone" className="input-label">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-white/30 text-dark/30" />
                <input
                  id="found-phone"
                  name="finderPhone"
                  type="tel"
                  required
                  value={form.finderPhone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="found-email" className="input-label">
                Email Address <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-white/30 text-dark/30" />
                <input
                  id="found-email"
                  name="finderEmail"
                  type="email"
                  value={form.finderEmail}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="found-message" className="input-label">
                Message to Owner <span className="dark:text-white/30 text-dark/40 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <MessageSquare size={15} className="absolute left-3.5 top-4 dark:text-white/30 text-dark/30" />
                <textarea
                  id="found-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder='e.g. "I found this at Central Park near the fountain."'
                  className="input pl-10 resize-none h-24"
                  maxLength={500}
                />
              </div>
            </div>

            {/* GPS Location */}
            <div className="border rounded-xl p-4 transition-colors" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="font-semibold dark:text-white/80 text-dark/80 text-sm">Share Your Location</p>
                  <p className="text-xs dark:text-white/40 text-dark/45 mt-0.5">Helps the owner know where to pick it up</p>
                </div>
                <button
                  type="button"
                  id="gps-button"
                  onClick={handleGPS}
                  disabled={gpsStatus === 'loading' || gpsStatus === 'granted'}
                  className={`w-full sm:w-auto justify-center inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 border ${
                    gpsStatus === 'granted'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      : gpsStatus === 'denied'
                      ? 'bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20'
                      : 'bg-lime/10 dark:bg-lime/20 text-lime-theme border-lime/20 hover:bg-lime/20 dark:hover:bg-lime/30'
                  }`}
                >
                  {gpsStatus === 'loading' && <Loader size={14} className="animate-spin" />}
                  {gpsStatus === 'granted' && <CheckCircle size={14} />}
                  {gpsStatus === 'denied' && <AlertCircle size={14} />}
                  {gpsStatus === 'idle' && <MapPin size={14} />}
                  {gpsStatus === 'idle' && 'Share GPS'}
                  {gpsStatus === 'loading' && 'Getting location...'}
                  {gpsStatus === 'granted' && 'Location shared ✓'}
                  {gpsStatus === 'denied' && 'Access denied'}
                </button>
              </div>
              {location && (
                <p className="text-xs dark:text-white/40 text-dark/40 mt-2 font-mono">
                  📍 {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                </p>
              )}
            </div>

            <button
              type="submit"
              id="found-submit"
              disabled={submitting}
              className="btn-primary w-full py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader size={16} className="animate-spin" />
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Send size={16} /> Submit Report
                </span>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs dark:text-white/40 text-dark/40 mt-6">
          Powered by{' '}
          <Link to="/" className="text-lime-theme font-semibold hover:underline">QRkFind</Link>
          {' '}— Smart QR Item Recovery
        </p>
      </main>
    </div>
  )
}

export default FoundPage
