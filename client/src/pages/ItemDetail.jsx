import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../utils/api'
import Navbar from '../components/Navbar'
import QRCard, { CATEGORY_ICONS } from '../components/QRCard'
import StatusBadge from '../components/StatusBadge'
import { ArrowLeft, MapPin, Phone, Mail, MessageSquare, Clock, User, CheckCircle, AlertTriangle, Copy } from 'lucide-react'
import { formatDateTime, timeAgo } from '../utils/dateFormat'
import toast from 'react-hot-toast'

let MapComponent = null

const LocationMap = ({ lat, lng }) => {
  const [MapLib, setMapLib] = useState(null)
  useEffect(() => { import('react-leaflet').then(mod => setMapLib(mod)).catch(() => {}) }, [])
  if (!MapLib) return (
    <div className="h-48 rounded-xl flex items-center justify-center text-sm transition-colors" style={{ background: 'var(--bg-card-2, var(--bg-card))', color: 'var(--text-muted)' }}>
      Loading map...
    </div>
  )
  const { MapContainer, TileLayer, Marker, Popup } = MapLib
  return (
    <MapContainer center={[lat, lng]} zoom={15} className="h-48 w-full rounded-xl z-0" scrollWheelZoom={false}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]}><Popup>Item found here</Popup></Marker>
    </MapContainer>
  )
}

const ReportCard = ({ report }) => {
  const hasLocation = report.location?.lat && report.location?.lng
  return (
    <div className="rounded-2xl p-5 animate-fade-in border-l-4 border-lime border transition-colors" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-lime/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <User size={18} className="text-lime" />
          </div>
          <div>
            <h4 className="font-display font-bold dark:text-white text-dark">{report.finderName}</h4>
            <div className="flex items-center gap-1 text-xs dark:text-white/40 text-dark/50 mt-0.5">
              <Clock size={11} />
              {timeAgo(report.createdAt)} · {formatDateTime(report.createdAt)}
            </div>
          </div>
        </div>
      </div>

      {/* Contact info */}
      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors" style={{ background: 'var(--bg-card-2, var(--bg-card))' }}>
          <Phone size={14} className="text-lime flex-shrink-0" />
          <div>
            <p className="text-[10px] dark:text-white/40 text-dark/40 font-semibold uppercase tracking-wide">Phone</p>
            <a href={`tel:${report.finderPhone}`} className="text-sm font-semibold text-lime hover:underline">{report.finderPhone}</a>
          </div>
        </div>
        {report.finderEmail && (
          <div className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors" style={{ background: 'var(--bg-card-2, var(--bg-card))' }}>
            <Mail size={14} className="text-lime flex-shrink-0" />
            <div>
              <p className="text-[10px] dark:text-white/40 text-dark/40 font-semibold uppercase tracking-wide">Email</p>
              <a href={`mailto:${report.finderEmail}`} className="text-sm font-semibold text-lime hover:underline truncate block">{report.finderEmail}</a>
            </div>
          </div>
        )}
      </div>

      {/* Message */}
      {report.message && (
        <div className="flex gap-2.5 bg-lime/10 rounded-xl px-4 py-3 mb-4">
          <MessageSquare size={15} className="text-lime flex-shrink-0 mt-0.5" />
          <p className="text-sm dark:text-white/70 text-dark/60 italic leading-relaxed">"{report.message}"</p>
        </div>
      )}

      {/* Location */}
      {hasLocation ? (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={14} className="text-lime" />
            <span className="text-xs font-semibold dark:text-white/60 text-dark/60">GPS Location Shared</span>
            <a href={`https://www.google.com/maps?q=${report.location.lat},${report.location.lng}`} target="_blank" rel="noopener noreferrer" className="text-xs text-lime hover:underline font-semibold ml-auto">
              Open in Google Maps →
            </a>
          </div>
          <LocationMap lat={report.location.lat} lng={report.location.lng} />
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs dark:text-white/30 text-dark/40">
          <MapPin size={13} /> Location not shared
        </div>
      )}
    </div>
  )
}

const ItemDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/api/items/${id}`)
        setItem(data.item)
        setReports(data.reports)
      } catch {
        toast.error('Item not found.')
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id, navigate])

  const handleStatusChange = async (newStatus) => {
    try {
      const { data } = await api.patch(`/api/items/${id}/status`, { status: newStatus })
      setItem(data.item)
      toast.success(newStatus === 'recovered' ? '✅ Marked as Recovered!' : 'Status updated.')
    } catch {
      toast.error('Failed to update status.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen transition-colors duration-300" style={{ background: 'var(--bg-surface)' }}>
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-lime/10 rounded-xl w-48" />
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="h-96 bg-lime/10 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-48 bg-lime/10 rounded-2xl" />
                <div className="h-32 bg-lime/10 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!item) return null

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: 'var(--bg-surface)' }}>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Back nav */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/dashboard')} className="btn-ghost p-2.5 border" style={{ borderColor: 'var(--border-color)' }}>
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-3xl">{CATEGORY_ICONS[item.category] || '📦'}</span>
              <h1 className="page-header mb-0">{item.name}</h1>
              <StatusBadge status={item.status} size="lg" />
            </div>
            <p className="dark:text-white/40 text-dark/50 text-sm mt-1 capitalize">
              {item.category} · Added {new Date(item.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: QR + item info */}
          <div className="space-y-6">
            <QRCard itemId={item.itemId} itemName={item.name} category={item.category} />

            {/* Item details card */}
            <div className="rounded-2xl p-6 border transition-colors" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <h3 className="font-display font-bold dark:text-white text-dark mb-4">Item Details</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-xs font-semibold dark:text-white/40 text-dark/40 uppercase tracking-wide">Item ID</dt>
                  <dd className="font-mono text-sm dark:text-white/60 text-dark/60 mt-0.5 break-all">{item.itemId}</dd>
                </div>
                {item.description && (
                  <div>
                    <dt className="text-xs font-semibold dark:text-white/40 text-dark/40 uppercase tracking-wide">Description</dt>
                    <dd className="text-sm dark:text-white/60 text-dark/60 mt-0.5 leading-relaxed">{item.description}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs font-semibold dark:text-white/40 text-dark/40 uppercase tracking-wide mb-1.5">Public Found URL</dt>
                  <dd className="flex items-center gap-2 bg-lime/5 dark:bg-white/5 border border-lime/20 dark:border-white/10 rounded-xl p-2.5 pl-3">
                    <span className="text-xs font-mono text-lime truncate flex-1 select-all">{window.location.origin}/found/{item.itemId}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/found/${item.itemId}`);
                        toast.success('Public URL copied! 📋');
                      }}
                      className="btn-ghost p-1.5 rounded-lg border-2 border-lime/30 text-lime hover:bg-lime hover:text-dark transition-all duration-200 text-xs font-semibold flex items-center justify-center flex-shrink-0"
                      title="Copy URL"
                    >
                      <Copy size={14} />
                    </button>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Status actions */}
            <div className="rounded-2xl p-5 border transition-colors" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <h3 className="font-display font-bold dark:text-white text-dark mb-3">Change Status</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                {item.status !== 'active' && (
                  <button onClick={() => handleStatusChange('active')} className="w-full sm:w-auto justify-center btn-ghost text-sm border" style={{ borderColor: 'var(--border-color)' }}>Set Active</button>
                )}
                {item.status !== 'lost' && (
                  <button onClick={() => handleStatusChange('lost')} className="w-full sm:w-auto justify-center inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl bg-orange-900/20 text-orange-400 border border-orange-700/30 hover:bg-orange-900/30 transition-colors">
                    <AlertTriangle size={14} /> Mark as Lost
                  </button>
                )}
                {item.status !== 'recovered' && (
                  <button onClick={() => handleStatusChange('recovered')} className="w-full sm:w-auto justify-center inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl bg-lime/10 text-lime border border-lime/20 hover:bg-lime/20 transition-colors">
                    <CheckCircle size={14} /> Mark Recovered
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right: Found reports */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold dark:text-white text-dark">
                Found Reports
                {reports.length > 0 && (
                  <span className="ml-2 text-sm font-semibold bg-lime/15 text-lime px-2.5 py-0.5 rounded-full">{reports.length}</span>
                )}
              </h2>
            </div>

            {reports.length === 0 ? (
              <div className="rounded-2xl p-10 text-center border transition-colors" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <div className="text-5xl mb-3">📭</div>
                <h3 className="font-display font-bold dark:text-white text-dark mb-1">No reports yet</h3>
                <p className="text-sm dark:text-white/40 text-dark/50">When someone scans this item's QR code and submits a report, it will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map(report => <ReportCard key={report._id} report={report} />)}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default ItemDetail
