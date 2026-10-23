import { useState } from 'react'
import api from '../utils/api'
import { X, CheckCircle, ShieldCheck, Loader, Phone, User, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const ClaimModal = ({ isOpen, onClose, complaint, onSuccess }) => {
  const { user } = useAuth()
  const [claimerName, setClaimerName] = useState(user?.name || '')
  const [claimerPhone, setClaimerPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen || !complaint) return null

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!claimerName.trim()) return toast.error('Please enter your name.')
    if (!claimerPhone.trim()) return toast.error('Please enter your phone number.')

    setSubmitting(true)

    try {
      await api.patch(`/api/complain-box/${complaint._id}/claim`, {
        claimerName: claimerName.trim(),
        claimerPhone: claimerPhone.trim(),
        notes: notes.trim(),
      })

      toast.success('Object marked as Claimed! 🎉')
      if (onSuccess) onSuccess()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update claim status.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg rounded-3xl border p-6 sm:p-8 shadow-2xl relative transition-all duration-300"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl border hover:bg-lime/20 hover:text-lime-theme transition-colors"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 bg-lime-theme-light rounded-2xl flex items-center justify-center text-lime-theme flex-shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold dark:text-white text-dark">
              Claim Object
            </h3>
            <p className="text-xs dark:text-white/50 text-dark/50">
              Is this your item? Register your claim details below.
            </p>
          </div>
        </div>

        {/* Item summary */}
        <div
          className="p-4 rounded-2xl border mb-5 space-y-1 text-xs"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
        >
          <div className="font-bold dark:text-white text-dark text-sm">{complaint.title}</div>
          <div className="dark:text-white/60 text-dark/60">
            📍 Found at: <span className="font-medium text-lime-theme">{complaint.locationFound}</span>
          </div>
          <div className="dark:text-white/60 text-dark/60">
            🏢 Currently kept: <span className="font-medium">{complaint.currentLocation || 'With Finder'}</span>
          </div>
          <div className="dark:text-white/60 text-dark/60">
            👤 Finder: <span className="font-medium">{complaint.finderName}</span> ({complaint.finderPhone})
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="input-label">Your Full Name <span className="text-red-400">*</span></label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-white/30 text-dark/30" />
              <input
                type="text"
                required
                value={claimerName}
                onChange={(e) => setClaimerName(e.target.value)}
                placeholder="e.g. John Doe"
                className="input pl-10"
              />
            </div>
          </div>

          <div>
            <label className="input-label">Your Phone Number <span className="text-red-400">*</span></label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-white/30 text-dark/30" />
              <input
                type="tel"
                required
                value={claimerPhone}
                onChange={(e) => setClaimerPhone(e.target.value)}
                placeholder="+91 98000 00000"
                className="input pl-10"
              />
            </div>
          </div>

          <div>
            <label className="input-label">Proof of Ownership / Remarks</label>
            <div className="relative">
              <FileText size={15} className="absolute left-3.5 top-3 dark:text-white/30 text-dark/30" />
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder='Describe password, engraving, contents, or how the finder can verify it belongs to you...'
                className="input pl-10 resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="btn-ghost px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary px-5 py-2 text-sm flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader size={15} className="animate-spin" />
                  Confirming Claim...
                </>
              ) : (
                <>
                  <CheckCircle size={15} />
                  Mark as Claimed
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ClaimModal
