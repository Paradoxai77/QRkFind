import { useState } from 'react'
import api from '../utils/api'
import {
  X,
  Upload,
  MapPin,
  Navigation,
  Loader,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Shield,
  Phone,
  Mail,
  User,
  Calendar,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = [
  { id: 'keys', label: 'Keys', icon: '🔑' },
  { id: 'wallet', label: 'Wallet / Purse', icon: '👛' },
  { id: 'phone', label: 'Phone / Tablet', icon: '📱' },
  { id: 'laptop', label: 'Laptop / Charger', icon: '💻' },
  { id: 'headphones', label: 'Earphones / Audio', icon: '🎧' },
  { id: 'watch', label: 'Watch / Wearable', icon: '⌚' },
  { id: 'bag', label: 'Backpack / Bag', icon: '🎒' },
  { id: 'bottle', label: 'Bottle / Flask', icon: '🍶' },
  { id: 'glasses', label: 'Glasses / Spectacles', icon: '👓' },
  { id: 'documents', label: 'IDs / Documents', icon: '📄' },
  { id: 'umbrella', label: 'Umbrella', icon: '☂️' },
  { id: 'other', label: 'Other Item', icon: '📦' },
]

const ReportFoundModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth()
  const [form, setForm] = useState({
    title: '',
    category: 'keys',
    description: '',
    locationFound: '',
    currentLocation: '',
    dateFound: new Date().toISOString().split('T')[0],
    finderName: user?.name || '',
    finderPhone: '',
    finderEmail: user?.email || '',
  })

  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [location, setLocation] = useState(null)
  const [gpsStatus, setGpsStatus] = useState('idle') // idle | loading | granted | denied | unavailable | timeout
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      return toast.error('Please select an image file (.jpg, .png, etc.)')
    }
    if (file.size > 5 * 1024 * 1024) {
      return toast.error('Photo size must be under 5MB')
    }
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleRemovePhoto = () => {
    setPhoto(null)
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhotoPreview(null)
  }

  const handleGPS = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.')
      setGpsStatus('unavailable')
      return
    }

    setGpsStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
          accuracy: pos.coords.accuracy ? Math.round(pos.coords.accuracy) : null,
        }
        setLocation(coords)
        setGpsStatus('granted')
        toast.success('📍 Location attached!')
      },
      (error) => {
        setLocation(null)
        if (error.code === 1) {
          setGpsStatus('denied')
          toast.error('Location permission was denied. You can submit without it.')
        } else if (error.code === 2) {
          setGpsStatus('unavailable')
          toast.error('GPS unavailable on this device.')
        } else if (error.code === 3) {
          setGpsStatus('timeout')
          toast.error('GPS request timed out.')
        } else {
          setGpsStatus('denied')
          toast.error('Could not acquire location.')
        }
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 30000 }
    )
  }

  const handleRemoveLocation = () => {
    setLocation(null)
    setGpsStatus('idle')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.title.trim()) return toast.error('Please enter the object title.')
    if (!form.description.trim()) return toast.error('Please add a description.')
    if (!form.locationFound.trim()) return toast.error('Please specify where you found it.')
    if (!form.finderName.trim()) return toast.error('Please enter your name.')
    if (!form.finderPhone.trim()) return toast.error('Please enter a contact phone number.')

    setSubmitting(true)

    try {
      const data = new FormData()
      data.append('title', form.title.trim())
      data.append('category', form.category)
      data.append('description', form.description.trim())
      data.append('locationFound', form.locationFound.trim())
      data.append('currentLocation', form.currentLocation.trim() || 'With Finder')
      data.append('dateFound', form.dateFound)
      data.append('finderName', form.finderName.trim())
      data.append('finderPhone', form.finderPhone.trim())
      if (form.finderEmail.trim()) data.append('finderEmail', form.finderEmail.trim())
      if (location) {
        data.append('lat', location.lat)
        data.append('lng', location.lng)
      }
      if (photo) {
        data.append('photo', photo)
      }

      await api.post('/api/complain-box', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      toast.success('Object reported to Complain Box! 🎉')
      if (onSuccess) onSuccess()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className="w-full max-w-2xl rounded-3xl border p-6 sm:p-8 my-8 shadow-2xl relative transition-all duration-300"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl border hover:bg-lime/20 hover:text-lime-theme transition-colors"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-lime-theme-light rounded-2xl flex items-center justify-center text-lime-theme flex-shrink-0">
            <HelpCircle size={24} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-lime-theme uppercase tracking-wider mb-0.5">
              <Shield size={12} /> Complain Box — Found Without QR
            </div>
            <h2 className="font-display text-2xl font-bold dark:text-white text-dark">
              Report an Object Found
            </h2>
            <p className="text-xs dark:text-white/50 text-dark/50">
              Found something with no QR code? Post details here so the owner can recognize and reclaim it.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Object Title <span className="text-red-400">*</span></label>
              <input
                type="text"
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                placeholder='e.g. "Titan Silver Watch", "Blue Water Bottle"'
                className="input"
                maxLength={100}
              />
            </div>
            <div>
              <label className="input-label">Category <span className="text-red-400">*</span></label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="input cursor-pointer"
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="input-label">
              Description & Identifying Marks <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              required
              rows={3}
              value={form.description}
              onChange={handleChange}
              placeholder='Describe color, brand, stickers, key count, or unique features so the real owner can verify it...'
              className="input resize-none"
              maxLength={1000}
            />
          </div>

          {/* Location Found & Currently Deposited At */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">
                Where Did You Find It? <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-white/30 text-dark/30" />
                <input
                  type="text"
                  name="locationFound"
                  required
                  value={form.locationFound}
                  onChange={handleChange}
                  placeholder='e.g. "Library 2nd floor, Table 12"'
                  className="input pl-10"
                  maxLength={150}
                />
              </div>
            </div>
            <div>
              <label className="input-label">
                Where Is It Kept Right Now?
              </label>
              <input
                type="text"
                name="currentLocation"
                value={form.currentLocation}
                onChange={handleChange}
                placeholder='e.g. "Security Gate 1 desk", "With Me"'
                className="input"
                maxLength={150}
              />
            </div>
          </div>

          {/* Date & Optional GPS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="input-label">Date Found</label>
              <div className="relative">
                <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-white/30 text-dark/30" />
                <input
                  type="date"
                  name="dateFound"
                  value={form.dateFound}
                  onChange={handleChange}
                  className="input pl-10"
                />
              </div>
            </div>

            {/* GPS Capture */}
            <div className="border rounded-xl p-3" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold dark:text-white/80 text-dark/80 flex items-center gap-1">
                    <Navigation size={12} className="text-lime-theme" /> GPS Coordinates
                  </span>
                  <span className="text-[11px] dark:text-white/40 text-dark/45 block">
                    {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Optional map pin'}
                  </span>
                </div>
                {location ? (
                  <button
                    type="button"
                    onClick={handleRemoveLocation}
                    className="text-xs text-red-500 hover:underline px-2 py-1"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleGPS}
                    disabled={gpsStatus === 'loading'}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border bg-lime/10 text-lime-theme border-lime/30 hover:bg-lime/20 flex items-center gap-1"
                  >
                    {gpsStatus === 'loading' ? <Loader size={12} className="animate-spin" /> : <MapPin size={12} />}
                    Share GPS
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="input-label">Object Photo <span className="text-xs font-normal opacity-60">(Optional)</span></label>
            {photoPreview ? (
              <div className="relative inline-block mt-1">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-2xl border"
                  style={{ borderColor: 'var(--border-color)' }}
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <label
                className="mt-1 flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-2xl cursor-pointer hover:border-lime-theme transition-colors text-center"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <Upload size={20} className="text-lime-theme mb-1" />
                <span className="text-xs font-semibold dark:text-white/80 text-dark/80">Upload Photo of Found Item</span>
                <span className="text-[11px] dark:text-white/40 text-dark/40">PNG, JPG, WebP up to 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Finder Contact Information */}
          <div className="border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
            <h4 className="text-xs font-bold uppercase tracking-wider dark:text-white/60 text-dark/60 mb-3 flex items-center gap-1.5">
              <User size={13} /> Your Contact Details (For Owner Verification)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="input-label">Your Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  name="finderName"
                  required
                  value={form.finderName}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className="input"
                />
              </div>
              <div>
                <label className="input-label">Phone Number <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-white/30 text-dark/30" />
                  <input
                    type="tel"
                    name="finderPhone"
                    required
                    value={form.finderPhone}
                    onChange={handleChange}
                    placeholder="+91 98000 00000"
                    className="input pl-9"
                  />
                </div>
              </div>
              <div>
                <label className="input-label">Email (Optional)</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-white/30 text-dark/30" />
                  <input
                    type="email"
                    name="finderEmail"
                    value={form.finderEmail}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="input pl-9"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="btn-ghost px-5 py-2.5 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Lodging in Complain Box...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Submit Found Object
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReportFoundModal
