import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import Navbar from '../components/Navbar'
import { CATEGORY_ICONS } from '../components/QRCard'
import StatusBadge from '../components/StatusBadge'
import { Bell, Phone, Mail, MapPin, Clock, ExternalLink } from 'lucide-react'
import { timeAgo, formatDateTime } from '../utils/dateFormat'
import toast from 'react-hot-toast'

const Notifications = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/api/items/notifications/all')
        setReports(data.reports)

        // Mark all as read (best-effort)
        const unread = data.reports.filter(r => !r.isRead)
        unread.forEach(r =>
          api.patch(`/api/items/reports/${r._id}/read`).catch(() => {})
        )
      } catch {
        toast.error('Failed to load notifications.')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const unreadCount = reports.filter(r => !r.isRead).length

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: 'var(--bg-surface)' }}>
      <Navbar unreadCount={0} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-lime/15 rounded-xl flex items-center justify-center">
            <Bell size={20} className="text-lime" />
          </div>
          <div>
            <h1 className="page-header mb-0">Notifications</h1>
            <p className="dark:text-white/40 text-dark/50 text-sm mt-0.5">
              {reports.length > 0
                ? `${reports.length} finder report${reports.length !== 1 ? 's' : ''} across all your items`
                : 'No finder reports yet'}
            </p>
          </div>
          {unreadCount > 0 && (
            <span className="ml-auto bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border rounded-2xl p-5 animate-pulse" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-lime/10 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-lime/10 rounded w-48" />
                    <div className="h-3 bg-lime/10 rounded w-32" />
                    <div className="h-3 bg-lime/10 rounded w-64" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="border rounded-2xl p-16 text-center" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="text-6xl mb-4">📭</div>
            <h3 className="font-display text-xl font-bold dark:text-white text-dark mb-2">No notifications yet</h3>
            <p className="dark:text-white/40 text-dark/50 mb-6">
              When someone finds and scans one of your items, a notification will appear here.
            </p>
            <Link to="/dashboard/add-item" className="btn-primary inline-flex">
              Register Your First Item
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map(report => (
              <div
                key={report._id}
                className={`border rounded-2xl p-5 animate-fade-in border-l-4 transition-all duration-300 ${
                  !report.isRead ? 'border-l-lime' : ''
                }`}
                style={{ background: 'var(--bg-card)', borderColor: !report.isRead ? undefined : 'var(--border-color)' }}
              >
                {/* Top: item info + time */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-lime/10 border border-lime/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                      {CATEGORY_ICONS[report.item?.category] || '📦'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display font-bold dark:text-white text-dark text-sm">
                          {report.item?.name || 'Unknown Item'}
                        </span>
                        {report.item?.status && <StatusBadge status={report.item.status} />}
                        {!report.isRead && (
                          <span className="text-[10px] bg-lime text-dark font-bold px-2 py-0.5 rounded-full">NEW</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs dark:text-white/40 text-dark/50 mt-0.5">
                        <Clock size={11} />
                        {timeAgo(report.createdAt)} · {formatDateTime(report.createdAt)}
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/dashboard/item/${report.item?._id}`}
                    className="flex items-center gap-1.5 text-xs text-lime font-semibold hover:underline flex-shrink-0"
                  >
                    View <ExternalLink size={11} />
                  </Link>
                </div>

                {/* Finder details */}
                <div className="rounded-xl p-4 border transition-colors" style={{ background: 'var(--bg-card-2)', borderColor: 'var(--border-color)' }}>
                  <p className="text-xs font-bold dark:text-white/40 text-dark/40 uppercase tracking-wide mb-3">Finder Details</p>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-6 h-6 bg-lime/15 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xs">👤</span>
                      </div>
                      <span className="font-semibold dark:text-white text-dark">{report.finderName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone size={11} className="text-blue-600" />
                      </div>
                      <a href={`tel:${report.finderPhone}`} className="text-lime font-semibold hover:underline">
                        {report.finderPhone}
                      </a>
                    </div>
                    {report.finderEmail && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail size={11} className="text-purple-600" />
                        </div>
                        <a href={`mailto:${report.finderEmail}`} className="text-lime font-semibold hover:underline truncate">
                          {report.finderEmail}
                        </a>
                      </div>
                    )}
                    {report.location?.lat && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-6 h-6 bg-lime/15 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin size={11} className="text-lime" />
                        </div>
                        <a
                          href={`https://www.google.com/maps?q=${report.location.lat},${report.location.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lime font-semibold hover:underline"
                        >
                          View on Maps
                        </a>
                      </div>
                    )}
                  </div>

                  {report.message && (
                    <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                      <p className="text-xs dark:text-white/50 text-dark/50 italic">"{report.message}"</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Notifications
