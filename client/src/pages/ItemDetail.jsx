import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../utils/api'
import Navbar from '../components/Navbar'
import QRCard, { CATEGORY_ICONS } from '../components/QRCard'
import StatusBadge from '../components/StatusBadge'
import { ArrowLeft, MapPin, Phone, Mail, MessageSquare, Clock, User, CheckCircle, AlertTriangle } from 'lucide-react'
import { formatDateTime, timeAgo } from '../utils/dateFormat'
import toast from 'react-hot-toast'

// Lazy-loaded map to avoid SSR issues
let MapComponent = null

const LocationMap = ({ lat, lng }) => {
  const [MapLib, setMapLib] = useState(null)

  useEffect(() => {
    import('react-leaflet').then(mod => setMapLib(mod)).catch(() => {})
  }, [])

  if (!MapLib) return (
    <div className="h-48 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-sm">
      Loading map...
    </div>
  )

  const { MapContainer, TileLayer, Marker, Popup } = MapLib

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      className="h-48 w-full rounded-xl z-0"
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]}>
        <Popup>Item found here</Popup>
      </Marker>
    </MapContainer>
  )
}

const ReportCard = ({ report }) => {
  const hasLocation = report.location?.lat && report.location?.lng

  return (
    <div className="card p-5 animate-fade-in border-l-4 border-primary-400">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <User size={18} className="text-primary-600" />
          </div>
          <div>
            <h4 className="font-display font-bold text-ink">{report.finderName}</h4>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
              <Clock size={11} />
              {timeAgo(report.createdAt)} · {formatDateTime(report.createdAt)}
            </div>
          </div>
        </div>
      </div>

      {/* Contact info */}
      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3 py-2.5">
          <Phone size={14} className="text-primary-500 flex-shrink-0" />
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Phone</p>
            <a href={`tel:${report.finderPhone}`} className="text-sm font-semibold text-ink hover:text-primary-600 transition-colors">
              {report.finderPhone}
            </a>
          </div>
        </div>
        {report.finderEmail && (
          <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3 py-2.5">
            <Mail size={14} className="text-primary-500 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Email</p>
              <a href={`mailto:${report.finderEmail}`} className="text-sm font-semibold text-ink hover:text-primary-600 transition-colors truncate block">
                {report.finderEmail}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Message */}
      {report.message && (
        <div className="flex gap-2.5 bg-primary-50 rounded-xl px-4 py-3 mb-4">
          <MessageSquare size={15} className="text-primary-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-700 italic leading-relaxed">"{report.message}"</p>
        </div>
      )}

      {/* Location */}
      {hasLocation ? (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={14} className="text-accent-500" />
            <span className="text-xs font-semibold text-slate-600">GPS Location Shared</span>
            <a
              href={`https://www.google.com/maps?q=${report.location.lat},${report.location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary-600 hover:underline font-semibold ml-auto"
            >
              Open in Google Maps →
            </a>
          </div>
          <LocationMap lat={report.location.lat} lng={report.location.lng} />
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <MapPin size={13} />
          Location not shared
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
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded-xl w-48" />
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="h-96 bg-slate-200 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-48 bg-slate-200 rounded-2xl" />
                <div className="h-32 bg-slate-200 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!item) return null

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Back nav */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/dashboard')} className="btn-ghost p-2.5 border border-slate-200">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-3xl">{CATEGORY_ICONS[item.category] || '📦'}</span>
              <h1 className="page-header mb-0">{item.name}</h1>
              <StatusBadge status={item.status} size="lg" />
            </div>
            <p className="text-slate-500 text-sm mt-1 capitalize">
              {item.category} · Added {new Date(item.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: QR + item info */}
          <div className="space-y-6">
            <QRCard itemId={item.itemId} itemName={item.name} category={item.category} />

            {/* Item details card */}
            <div className="card p-6">
              <h3 className="font-display font-bold text-ink mb-4">Item Details</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Item ID</dt>
                  <dd className="font-mono text-sm text-slate-600 mt-0.5 break-all">{item.itemId}</dd>
                </div>
                {item.description && (
                  <div>
                    <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Description</dt>
                    <dd className="text-sm text-slate-600 mt-0.5 leading-relaxed">{item.description}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Public Found URL</dt>
                  <dd className="text-xs font-mono text-primary-600 mt-0.5 break-all">
                    {window.location.origin}/found/{item.itemId}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Status actions */}
            <div className="card p-5">
              <h3 className="font-display font-bold text-ink mb-3">Change Status</h3>
              <div className="flex gap-2 flex-wrap">
                {item.status !== 'active' && (
                  <button onClick={() => handleStatusChange('active')} className="btn-ghost text-sm border border-slate-200">
                    Set Active
                  </button>
                )}
                {item.status !== 'lost' && (
                  <button onClick={() => handleStatusChange('lost')} className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-warn-50 text-warn-600 border border-warn-200 hover:bg-warn-100 transition-colors">
                    <AlertTriangle size={14} /> Mark as Lost
                  </button>
                )}
                {item.status !== 'recovered' && (
                  <button onClick={() => handleStatusChange('recovered')} className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-accent-50 text-accent-600 border border-accent-200 hover:bg-accent-100 transition-colors">
                    <CheckCircle size={14} /> Mark Recovered
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right: Found reports */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold text-ink">
                Found Reports
                {reports.length > 0 && (
                  <span className="ml-2 text-sm font-semibold bg-primary-100 text-primary-700 px-2.5 py-0.5 rounded-full">
                    {reports.length}
                  </span>
                )}
              </h2>
            </div>

            {reports.length === 0 ? (
              <div className="card p-10 text-center">
                <div className="text-5xl mb-3">📭</div>
                <h3 className="font-display font-bold text-ink mb-1">No reports yet</h3>
                <p className="text-sm text-slate-500">
                  When someone scans this item's QR code and submits a report, it will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map(report => (
                  <ReportCard key={report._id} report={report} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default ItemDetail
