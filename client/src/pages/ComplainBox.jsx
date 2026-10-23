import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import ReportFoundModal from '../components/ReportFoundModal'
import ClaimModal from '../components/ClaimModal'
import {
  HelpCircle,
  Plus,
  Search,
  MapPin,
  Calendar,
  Phone,
  Mail,
  User,
  CheckCircle,
  Clock,
  ExternalLink,
  ShieldAlert,
  Inbox,
  Bell,
  Trash2,
  Package,
  ShieldCheck,
  Eye,
} from 'lucide-react'
import { timeAgo, formatDateTime } from '../utils/dateFormat'
import toast from 'react-hot-toast'

const CATEGORY_MAP = {
  keys: { label: 'Keys', icon: '🔑' },
  wallet: { label: 'Wallet', icon: '👛' },
  phone: { label: 'Phone', icon: '📱' },
  laptop: { label: 'Laptop', icon: '💻' },
  headphones: { label: 'Audio', icon: '🎧' },
  watch: { label: 'Watch', icon: '⌚' },
  bag: { label: 'Bag / Backpack', icon: '🎒' },
  bottle: { label: 'Bottle', icon: '🍶' },
  glasses: { label: 'Glasses', icon: '👓' },
  documents: { label: 'Documents', icon: '📄' },
  umbrella: { label: 'Umbrella', icon: '☂️' },
  other: { label: 'Other', icon: '📦' },
}

const ComplainBox = () => {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [stats, setStats] = useState({ total: 0, unclaimed: 0, claimed: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all') // all | unclaimed | claimed

  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [expandedPhoto, setExpandedPhoto] = useState(null)

  const fetchComplaints = async () => {
    try {
      setLoading(true)
      const [resComplaints, resStats] = await Promise.all([
        api.get('/api/complain-box'),
        api.get('/api/complain-box/stats'),
      ])
      setComplaints(resComplaints.data.complaints || [])
      setStats(resStats.data.stats || { total: 0, unclaimed: 0, claimed: 0 })
    } catch {
      toast.error('Failed to load complain box records.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete report for "${title}" from Complain Box?`)) return
    try {
      await api.delete(`/api/complain-box/${id}`)
      toast.success('Report removed.')
      fetchComplaints()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete report.')
    }
  }

  const handleOpenClaim = (comp) => {
    setSelectedComplaint(comp)
    setIsClaimModalOpen(true)
  }

  // Filter complaints locally for smooth UX
  const filtered = complaints.filter((comp) => {
    if (categoryFilter !== 'all' && comp.category !== categoryFilter) return false
    if (statusFilter === 'unclaimed' && comp.status === 'claimed') return false
    if (statusFilter === 'claimed' && comp.status !== 'claimed') return false
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      const match =
        comp.title?.toLowerCase().includes(q) ||
        comp.description?.toLowerCase().includes(q) ||
        comp.locationFound?.toLowerCase().includes(q) ||
        comp.currentLocation?.toLowerCase().includes(q) ||
        comp.finderName?.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: 'var(--bg-surface)' }}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold dark:text-white/50 text-dark/50">
            <Link to="/dashboard" className="hover:text-lime-theme transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-lime-theme">Complain Box</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard/notifications"
              className="btn-ghost px-3.5 py-1.5 text-xs flex items-center gap-1.5 border"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <Bell size={14} className="text-lime-theme" />
              <span>QR Code Alerts</span>
            </Link>
          </div>
        </div>

        {/* Hero Header */}
        <div
          className="rounded-3xl p-6 sm:p-8 border-2 transition-colors relative overflow-hidden mb-8"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="max-w-xl">
              <span className="section-tag mb-3 inline-flex items-center gap-1.5">
                <ShieldAlert size={12} /> Community Lost & Found Box
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold dark:text-white text-dark mb-2">
                Complain Box <span className="text-lime-theme">(No QR)</span>
              </h1>
              <p className="dark:text-white/60 text-dark/60 text-sm leading-relaxed">
                Found an object without any QR code? Lodge it here so students and rightful owners can identify, verify, and reclaim their lost belongings.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="btn-primary py-3.5 px-6 text-sm flex items-center justify-center gap-2 shadow-lime-glow"
              >
                <Plus size={18} />
                Report Object Found (No QR)
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div
            className="p-5 rounded-2xl border flex items-center gap-4 transition-all"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <div className="w-12 h-12 bg-lime-theme-light text-lime-theme rounded-xl flex items-center justify-center flex-shrink-0">
              <Inbox size={22} />
            </div>
            <div>
              <div className="text-2xl font-bold font-display dark:text-white text-dark">{stats.total}</div>
              <div className="text-xs dark:text-white/40 text-dark/50 font-medium">Total Objects Logged</div>
            </div>
          </div>

          <div
            className="p-5 rounded-2xl border flex items-center gap-4 transition-all"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <HelpCircle size={22} />
            </div>
            <div>
              <div className="text-2xl font-bold font-display text-amber-500">{stats.unclaimed}</div>
              <div className="text-xs dark:text-white/40 text-dark/50 font-medium">Awaiting Owner (Unclaimed)</div>
            </div>
          </div>

          <div
            className="p-5 rounded-2xl border flex items-center gap-4 transition-all"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="text-2xl font-bold font-display text-emerald-500">{stats.claimed}</div>
              <div className="text-xs dark:text-white/40 text-dark/50 font-medium">Successfully Reunited</div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-white/30 text-dark/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by object name, location, or finder..."
                className="input pl-10 w-full"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl border w-full sm:w-auto" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              {[
                { id: 'all', label: 'All' },
                { id: 'unclaimed', label: 'Unclaimed' },
                { id: 'claimed', label: 'Claimed' },
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => setStatusFilter(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === s.id
                      ? 'bg-lime text-dark shadow-sm'
                      : 'dark:text-white/60 text-dark/60 hover:text-lime-theme'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                categoryFilter === 'all'
                  ? 'bg-lime text-dark border-lime'
                  : 'bg-transparent dark:text-white/60 text-dark/60 border-dark/10 dark:border-white/10 hover:border-lime/30'
              }`}
            >
              All Categories ({complaints.length})
            </button>
            {Object.entries(CATEGORY_MAP).map(([key, val]) => {
              const count = complaints.filter(c => c.category === key).length
              return (
                <button
                  key={key}
                  onClick={() => setCategoryFilter(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                    categoryFilter === key
                      ? 'bg-lime text-dark border-lime'
                      : 'bg-transparent dark:text-white/60 text-dark/60 border-dark/10 dark:border-white/10 hover:border-lime/30'
                  }`}
                >
                  <span>{val.icon}</span>
                  <span>{val.label}</span>
                  {count > 0 && <span className="opacity-60 text-[10px]">({count})</span>}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-lime-theme border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="dark:text-white/50 text-dark/50 text-sm">Loading Complain Box items...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="rounded-3xl p-16 text-center border-2 transition-colors"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <div className="text-6xl mb-4">📭</div>
            <h3 className="font-display text-2xl font-bold dark:text-white text-dark mb-2">
              No matching found objects
            </h3>
            <p className="text-sm dark:text-white/50 text-dark/50 max-w-md mx-auto mb-6">
              {complaints.length === 0
                ? "The Complain Box is currently clear! If you found an item without a QR code, report it now to help return it."
                : "No items match your active filters or search keyword. Try clearing your search."}
            </p>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="btn-primary inline-flex items-center gap-2 text-sm"
            >
              <Plus size={16} /> Report Found Object
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((comp) => {
              const cat = CATEGORY_MAP[comp.category] || { label: comp.category, icon: '📦' }
              const isClaimed = comp.status === 'claimed'
              const canDelete =
                user &&
                (user.role === 'admin' ||
                  user.email === 'pratiknerpagar2@gmail.com' ||
                  comp.reportedBy === user.id)

              return (
                <div
                  key={comp._id}
                  className={`rounded-3xl border-2 p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 card-glow ${
                    isClaimed ? 'opacity-85' : ''
                  }`}
                  style={{ background: 'var(--bg-card)', borderColor: isClaimed ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)' }}
                >
                  <div>
                    {/* Top Row: Category + Status Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-xl bg-lime-theme-light text-lime-theme">
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </span>

                      <div className="flex items-center gap-2">
                        {isClaimed ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                            <CheckCircle size={11} /> Reunited
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30">
                            <Clock size={11} /> Unclaimed
                          </span>
                        )}

                        {canDelete && (
                          <button
                            onClick={() => handleDelete(comp._id, comp.title)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete report"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Photo if present */}
                    {comp.photoUrl && (
                      <div
                        onClick={() => setExpandedPhoto(comp.photoUrl)}
                        className="relative w-full h-44 mb-3 rounded-2xl overflow-hidden cursor-pointer group border"
                        style={{ borderColor: 'var(--border-color)' }}
                      >
                        <img
                          src={comp.photoUrl}
                          alt={comp.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-dark/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold gap-1">
                          <Eye size={14} /> Click to View
                        </div>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="font-display text-lg font-bold dark:text-white text-dark mb-1 leading-snug">
                      {comp.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs dark:text-white/60 text-dark/60 leading-relaxed mb-4 line-clamp-3">
                      {comp.description}
                    </p>

                    {/* Key Location Badges */}
                    <div className="space-y-2 mb-4 text-xs">
                      <div className="flex items-start gap-2">
                        <MapPin size={13} className="text-lime-theme flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="dark:text-white/40 text-dark/50">Found at: </span>
                          <span className="font-semibold dark:text-white/90 text-dark/90">{comp.locationFound}</span>
                        </div>
                      </div>

                      {comp.currentLocation && (
                        <div className="flex items-start gap-2">
                          <Package size={13} className="text-lime-theme flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="dark:text-white/40 text-dark/50">Currently deposited: </span>
                            <span className="font-semibold dark:text-white/90 text-dark/90">{comp.currentLocation}</span>
                          </div>
                        </div>
                      )}

                      {comp.coordinates?.lat && (
                        <div className="pl-5">
                          <a
                            href={`https://www.google.com/maps?q=${comp.coordinates.lat},${comp.coordinates.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-lime-theme hover:underline"
                          >
                            <ExternalLink size={10} /> View GPS Location on Map
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom: Finder Info & Claim Button */}
                  <div className="border-t pt-3 mt-2" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-lime rounded-full flex items-center justify-center text-dark text-xs font-bold">
                          {comp.finderName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-semibold dark:text-white text-dark leading-tight">{comp.finderName}</p>
                          <p className="text-[10px] dark:text-white/40 text-dark/50">{timeAgo(comp.createdAt)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <a
                          href={`tel:${comp.finderPhone}`}
                          className="p-1.5 rounded-lg border hover:bg-lime/20 text-lime-theme transition-colors"
                          title="Call Finder"
                        >
                          <Phone size={13} />
                        </a>
                        {comp.finderEmail && (
                          <a
                            href={`mailto:${comp.finderEmail}`}
                            className="p-1.5 rounded-lg border hover:bg-lime/20 text-lime-theme transition-colors"
                            title="Email Finder"
                          >
                            <Mail size={13} />
                          </a>
                        )}
                      </div>
                    </div>

                    {isClaimed ? (
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs text-center font-medium">
                        ✓ Reunited with owner ({comp.claimedBy?.name || 'Claimed'})
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenClaim(comp)}
                        className="w-full btn-primary py-2 text-xs flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck size={14} />
                        Claim This Object
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Report Modal */}
      <ReportFoundModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSuccess={fetchComplaints}
      />

      {/* Claim Modal */}
      <ClaimModal
        isOpen={isClaimModalOpen}
        onClose={() => {
          setIsClaimModalOpen(false)
          setSelectedComplaint(null)
        }}
        complaint={selectedComplaint}
        onSuccess={fetchComplaints}
      />

      {/* Photo Lightbox */}
      {expandedPhoto && (
        <div
          onClick={() => setExpandedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-md cursor-pointer animate-fade-in"
        >
          <img
            src={expandedPhoto}
            alt="Expanded view"
            className="max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl object-contain border"
            style={{ borderColor: 'var(--border-color)' }}
          />
        </div>
      )}
    </div>
  )
}

export default ComplainBox
