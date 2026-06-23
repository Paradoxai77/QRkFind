import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import Navbar from '../components/Navbar'
import QRCard from '../components/QRCard'
import { Package, ChevronDown, Upload, X, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { value: 'phone',       label: '📱 Phone' },
  { value: 'keys',        label: '🔑 Keys' },
  { value: 'wallet',      label: '👛 Wallet' },
  { value: 'bag',         label: '🎒 Bag / Backpack' },
  { value: 'umbrella',    label: '☂️ Umbrella' },
  { value: 'laptop',      label: '💻 Laptop' },
  { value: 'headphones',  label: '🎧 Headphones' },
  { value: 'glasses',     label: '👓 Glasses' },
  { value: 'watch',       label: '⌚ Watch' },
  { value: 'camera',      label: '📷 Camera' },
  { value: 'book',        label: '📚 Book' },
  { value: 'calculator',  label: '🧮 Calculator' },
  { value: 'other',       label: '📦 Other' },
]

const AddItem = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', category: '', description: '' })
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [createdItem, setCreatedItem] = useState(null)

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Photo must be under 5MB'); return }
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return toast.error('Item name is required.')
    if (!form.category) return toast.error('Please select a category.')
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', form.name.trim())
      formData.append('category', form.category)
      formData.append('description', form.description.trim())
      if (photo) formData.append('photo', photo)
      const { data } = await api.post('/api/items', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      setCreatedItem(data.item)
      toast.success('Item registered! Your QR code is ready 🎉')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create item.')
    } finally {
      setLoading(false)
    }
  }

  // ── Success state: show QR code ──
  if (createdItem) {
    return (
      <div className="min-h-screen transition-colors duration-300" style={{ background: 'var(--bg-surface)' }}>
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-8 animate-slide-up">
            <div className="w-16 h-16 bg-lime-theme-light rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-lime-theme" />
            </div>
            <h1 className="font-display text-3xl font-extrabold dark:text-white text-dark mb-2">Item Registered!</h1>
            <p className="dark:text-white/50 text-dark/60">
              Your QR code is ready. Download or print it and attach it to your <strong className="dark:text-white text-dark">{createdItem.name}</strong>.
            </p>
          </div>
          <QRCard itemId={createdItem.itemId} itemName={createdItem.name} category={createdItem.category} />
          <div className="flex gap-3 mt-6">
            <button onClick={() => navigate(`/dashboard/item/${createdItem._id}`)} className="btn-primary flex-1">View Item Details</button>
            <button onClick={() => { setCreatedItem(null); setForm({ name: '', category: '', description: '' }); setPhoto(null); setPhotoPreview(null) }} className="btn-secondary flex-1">Add Another Item</button>
          </div>
        </main>
      </div>
    )
  }

  // ── Form ──
  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: 'var(--bg-surface)' }}>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/dashboard')} className="btn-ghost p-2.5 border" style={{ borderColor: 'var(--border-color)' }} aria-label="Back to dashboard">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="page-header">Register New Item</h1>
            <p className="dark:text-white/40 text-dark/50 text-sm mt-0.5">Fill in the details and we'll generate a unique QR code.</p>
          </div>
        </div>

        <div className="rounded-2xl p-8 border transition-colors" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <form onSubmit={handleSubmit} className="space-y-6" id="add-item-form">
            {/* Item Name */}
            <div>
              <label htmlFor="item-name" className="input-label">
                Item Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Package size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-white/30 text-dark/30" />
                <input id="item-name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="e.g. My House Keys" className="input pl-10" maxLength={100} />
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="item-category" className="input-label">
                Category <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select id="item-category" name="category" required value={form.category} onChange={handleChange} className="input appearance-none pr-10 cursor-pointer">
                  <option value="">Select a category...</option>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 dark:text-white/30 text-dark/30 pointer-events-none" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="item-description" className="input-label">
                Description <span className="dark:text-white/30 text-dark/40 font-normal">(Optional)</span>
              </label>
              <textarea id="item-description" name="description" value={form.description} onChange={handleChange} placeholder="e.g. Black Honda key fob with keychain" className="input resize-none h-24" maxLength={500} />
              <p className="text-xs dark:text-white/30 text-dark/40 mt-1 text-right">{form.description.length}/500</p>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="input-label">
                Photo <span className="dark:text-white/30 text-dark/40 font-normal">(Optional, max 5MB)</span>
              </label>
              {photoPreview ? (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border-2" style={{ borderColor: 'var(--border-color)' }}>
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => { setPhoto(null); setPhotoPreview(null) }} className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 text-dark/60 hover:text-red-500 transition-colors shadow" aria-label="Remove photo">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label htmlFor="photo-upload" className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer hover:border-lime hover:bg-lime/5 transition-all duration-200 group" style={{ borderColor: 'var(--border-color)' }}>
                  <Upload size={24} className="dark:text-white/30 text-dark/30 group-hover:text-lime mb-2 transition-colors" />
                  <span className="text-sm dark:text-white/50 text-dark/50 group-hover:text-lime font-medium">Click to upload a photo</span>
                  <span className="text-xs dark:text-white/30 text-dark/40 mt-1">JPG, PNG, WEBP up to 5MB</span>
                  <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                </label>
              )}
            </div>

            {/* Info notice */}
            <div className="bg-lime-theme-light border border-lime-theme rounded-xl p-4 text-sm text-lime-theme">
              <strong>💡 How it works:</strong> After submitting, we'll generate a unique QR code linked to a public "Found This?" page. Print it and attach it to your item. The finder never sees your personal details.
            </div>

            <button type="submit" id="add-item-submit" disabled={loading} className="btn-primary w-full py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                  Generating QR Code...
                </span>
              ) : '✨ Register Item & Generate QR'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default AddItem
