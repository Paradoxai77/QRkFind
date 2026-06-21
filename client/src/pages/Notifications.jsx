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
    <div className="min-h-screen bg-surface">
      <Navbar unreadCount={0} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <Bell size={20} className="text-primary-600" />
          </div>
          <div>
            <h1 className="page-header mb-0">Notifications</h1>
            <p className="text-slate-500 text-sm mt-0.5">
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
              <div key={i} className="card p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-48" />
                    <div className="h-3 bg-slate-200 rounded w-32" />
                    <div className="h-3 bg-slate-200 rounded w-64" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="font-display text-xl font-bold text-ink mb-2">No notifications yet</h3>
            <p className="text-slate-500 mb-6">
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
                className={`card p-5 animate-fade-in border-l-4 transition-all duration-300 ${
                  !report.isRead ? 'border-primary-500 bg-primary-50/30' : 'border-slate-200'
                }`}
              >
                {/* Top: item info + time */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-primary-50 to-blue-50 border border-primary-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                      {CATEGORY_ICONS[report.item?.category] || '📦'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display font-bold text-ink text-sm">
                          {report.item?.name || 'Unknown Item'}
                        </span>
                        {report.item?.status && <StatusBadge status={report.item.status} />}
                        {!report.isRead && (
                          <span className="text-[10px] bg-primary-500 text-white font-bold px-2 py-0.5 rounded-full">NEW</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                        <Clock size={11} />
                        {timeAgo(report.createdAt)} · {formatDateTime(report.createdAt)}
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/dashboard/item/${report.item?._id}`}
                    className="flex items-center gap-1.5 text-xs text-primary-600 font-semibold hover:underline flex-shrink-0"
                  >
                    View <ExternalLink size={11} />
                  </Link>
                </div>

                {/* Finder details */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Finder Details</p>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-6 h-6 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xs">👤</span>
                      </div>
                      <span className="font-semibold text-ink">{report.finderName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone size={11} className="text-blue-600" />
                      </div>
                      <a href={`tel:${report.finderPhone}`} className="text-primary-600 font-semibold hover:underline">
                        {report.finderPhone}
                      </a>
                    </div>
                    {report.finderEmail && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail size={11} className="text-purple-600" />
                        </div>
                        <a href={`mailto:${report.finderEmail}`} className="text-primary-600 font-semibold hover:underline truncate">
                          {report.finderEmail}
                        </a>
                      </div>
                    )}
                    {report.location?.lat && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-6 h-6 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin size={11} className="text-accent-600" />
                        </div>
                        <a
                          href={`https://www.google.com/maps?q=${report.location.lat},${report.location.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent-600 font-semibold hover:underline"
                        >
                          View on Maps
                        </a>
                      </div>
                    )}
                  </div>

                  {report.message && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <p className="text-xs text-slate-500 italic">"{report.message}"</p>
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
