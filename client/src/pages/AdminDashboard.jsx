import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../utils/api'
import {
  Users,
  Package,
  AlertTriangle,
  ShieldAlert,
  Trash2,
  Search,
  ExternalLink,
  RefreshCw,
  Clock,
  MapPin,
  CheckCircle,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'
import StatusBadge from '../components/StatusBadge'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalItems: 0,
    totalReports: 0,
    activeItems: 0,
    lostItems: 0,
    recoveredItems: 0
  })
  const [usersList, setUsersList] = useState([])
  const [itemsList, setItemsList] = useState([])
  const [reportsList, setReportsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('users') // 'users' | 'items' | 'reports'
  const [searchQuery, setSearchQuery] = useState('')

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    type: '', // 'user' | 'item' | 'report'
    id: '',
    name: ''
  })
  const [deleting, setDeleting] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsRes, usersRes, itemsRes, reportsRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/users'),
        api.get('/api/admin/items'),
        api.get('/api/admin/reports')
      ])

      setStats(statsRes.data.stats)
      setUsersList(usersRes.data.users)
      setItemsList(itemsRes.data.items)
      setReportsList(reportsRes.data.reports)
    } catch (err) {
      toast.error('Failed to load administrative data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const openDeleteModal = (type, id, name) => {
    setDeleteModal({ open: true, type, id, name })
  }

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, type: '', id: '', name: '' })
  }

  const handleDeleteConfirm = async () => {
    const { type, id } = deleteModal
    setDeleting(true)
    try {
      if (type === 'user') {
        await api.delete(`/api/admin/users/${id}`)
        toast.success('User and associated data deleted.')
      } else if (type === 'item') {
        await api.delete(`/api/admin/items/${id}`)
        toast.success('Item and associated reports deleted.')
      } else if (type === 'report') {
        await api.delete(`/api/admin/reports/${id}`)
        toast.success('Report deleted successfully.')
      }
      fetchData()
      closeDeleteModal()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete operation failed.')
    } finally {
      setDeleting(false)
    }
  }

  // Formatting helpers
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Filter lists based on search
  const filteredUsers = usersList.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredItems = itemsList.filter(i =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (i.owner?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (i.owner?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.itemId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredReports = reportsList.filter(r =>
    r.finderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.finderEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.item?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.message || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen transition-colors duration-300 pb-16" style={{ background: 'var(--bg-surface)' }}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="section-tag mb-3 inline-block bg-red-900/30 text-red-400 border border-red-800/40">🛡️ Security operations</span>
            <h1 className="font-display text-3xl font-bold dark:text-white text-dark">
              Admin Portal
            </h1>
            <p className="dark:text-white/40 text-dark/50 mt-1">
              QRkFind system status, security overrides, and database governance controls.
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="btn-ghost self-start md:self-auto border flex items-center gap-2"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh Data
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Users */}
          <div className="rounded-2xl p-5 flex items-center gap-4 border-2 transition-all duration-300" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-500/10 text-blue-400">
              <Users size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold font-display dark:text-white text-dark">{stats.totalUsers}</div>
              <div className="text-xs font-medium dark:text-white/40 text-dark/50">Total Members</div>
            </div>
          </div>

          {/* Total Items */}
          <div className="rounded-2xl p-5 flex items-center gap-4 border-2 transition-all duration-300" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-lime-theme-light text-lime-theme">
              <Package size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold font-display dark:text-white text-dark">{stats.totalItems}</div>
              <div className="text-xs font-medium dark:text-white/40 text-dark/50">Registered Items ({stats.lostItems} Lost)</div>
            </div>
          </div>

          {/* Total Reports */}
          <div className="rounded-2xl p-5 flex items-center gap-4 border-2 transition-all duration-300" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-orange-500/10 text-orange-400">
              <AlertTriangle size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold font-display dark:text-white text-dark">{stats.totalReports}</div>
              <div className="text-xs font-medium dark:text-white/40 text-dark/50">Found Reports</div>
            </div>
          </div>

          {/* Security Status */}
          <div className="rounded-2xl p-5 flex items-center gap-4 border-2 transition-all duration-300" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-500/10 text-red-400">
              <ShieldAlert size={20} />
            </div>
            <div>
              <div className="text-lg font-bold font-display text-red-400 uppercase tracking-wide">SECURE</div>
              <div className="text-xs font-medium dark:text-white/40 text-dark/50">Mock DB • SSL Encrypted</div>
            </div>
          </div>
        </div>

        {/* Tab Selection + Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6 border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
          {/* Tabs */}
          <div className="flex gap-1.5 p-1 rounded-xl bg-dark/15 dark:bg-white/5 border self-start" style={{ borderColor: 'var(--border-color)' }}>
            {[
              { id: 'users', label: 'Users', icon: <Users size={14} /> },
              { id: 'items', label: 'Items', icon: <Package size={14} /> },
              { id: 'reports', label: 'Found Reports', icon: <AlertTriangle size={14} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearchQuery('') }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-lime text-dark shadow-sm'
                    : 'bg-transparent dark:text-white/60 text-dark/60 hover:text-lime-theme'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-white/30 text-dark/30" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 py-2.5 rounded-xl text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 dark:text-white/40 text-dark/40 hover:text-white"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="border-2 rounded-3xl p-24 text-center transition-colors" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="w-10 h-10 border-4 border-lime/30 border-t-lime rounded-full animate-spin mx-auto mb-4" />
            <p className="dark:text-white/40 text-dark/50 text-sm">Loading security tables...</p>
          </div>
        ) : (
          <div className="border-2 rounded-3xl overflow-hidden transition-colors" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            {/* 1. USERS TAB */}
            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                      <th className="p-4 font-bold dark:text-white/70 text-dark/60">Name</th>
                      <th className="p-4 font-bold dark:text-white/70 text-dark/60">Email</th>
                      <th className="p-4 font-bold dark:text-white/70 text-dark/60">Role</th>
                      <th className="p-4 font-bold dark:text-white/70 text-dark/60">Registered</th>
                      <th className="p-4 font-bold dark:text-white/70 text-dark/60 text-center">Items</th>
                      <th className="p-4 font-bold dark:text-white/70 text-dark/60 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center dark:text-white/30 text-dark/40 italic">No users matching search query.</td>
                      </tr>
                    ) : (
                      filteredUsers.map(u => (
                        <tr key={u._id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-bold dark:text-white text-dark">{u.name}</td>
                          <td className="p-4 font-mono dark:text-white/60 text-dark/60">{u.email}</td>
                          <td className="p-4">
                            <span className={`inline-flex px-2 py-0.5 text-xs font-bold rounded ${
                              u.role === 'admin' ? 'bg-red-900/30 text-red-400 border border-red-800/30' : 'bg-lime-theme-light text-lime-theme border border-lime-theme'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4 dark:text-white/55 text-dark/50">{formatDate(u.createdAt)}</td>
                          <td className="p-4 text-center font-semibold dark:text-white text-dark">{u.itemCount}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => openDeleteModal('user', u._id, u.name)}
                              className="btn-danger p-2 hover:bg-red-800/50 transition-all rounded-lg"
                              title="Delete User & Associated Data"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* 2. ITEMS TAB */}
            {activeTab === 'items' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                      <th className="p-4 font-bold dark:text-white/70 text-dark/60">QR Key</th>
                      <th className="p-4 font-bold dark:text-white/70 text-dark/60">Item Name</th>
                      <th className="p-4 font-bold dark:text-white/70 text-dark/60">Category</th>
                      <th className="p-4 font-bold dark:text-white/70 text-dark/60">Owner</th>
                      <th className="p-4 font-bold dark:text-white/70 text-dark/60 text-center">Reports</th>
                      <th className="p-4 font-bold dark:text-white/70 text-dark/60">Status</th>
                      <th className="p-4 font-bold dark:text-white/70 text-dark/60 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                    {filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-8 text-center dark:text-white/30 text-dark/40 italic">No items matching search query.</td>
                      </tr>
                    ) : (
                      filteredItems.map(i => (
                        <tr key={i._id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono text-xs text-lime-theme select-all flex items-center gap-1.5">
                            {i.itemId}
                            <a href={`/found/${i.itemId}`} target="_blank" rel="noreferrer" title="Open Public Finder Page" className="hover:scale-110 text-lime-theme/70 hover:text-lime-theme transition-all">
                              <ExternalLink size={12} />
                            </a>
                          </td>
                          <td className="p-4 font-bold dark:text-white text-dark">{i.name}</td>
                          <td className="p-4 capitalize dark:text-white/60 text-dark/60">{i.category}</td>
                          <td className="p-4">
                            <div className="font-semibold dark:text-white text-dark">{i.owner?.name}</div>
                            <div className="text-xs dark:text-white/35 text-dark/40 font-mono">{i.owner?.email}</div>
                          </td>
                          <td className="p-4 text-center font-bold dark:text-white text-dark">{i.reportCount}</td>
                          <td className="p-4">
                            <StatusBadge status={i.status} />
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => openDeleteModal('item', i._id, i.name)}
                              className="btn-danger p-2 hover:bg-red-800/50 transition-all rounded-lg"
                              title="Delete Item & Reports"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* 3. REPORTS TAB */}
            {activeTab === 'reports' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                      <th className="p-4 font-bold dark:text-white/70 text-dark/60">Finder</th>
                      <th className="p-4 font-bold dark:text-white/70 text-dark/60">Report Message</th>
                      <th className="p-4 font-bold dark:text-white/70 text-dark/60">Location</th>
                      <th className="p-4 font-bold dark:text-white/70 text-dark/60">Related Item</th>
                      <th className="p-4 font-bold dark:text-white/70 text-dark/60">Owner</th>
                      <th className="p-4 font-bold dark:text-white/70 text-dark/60 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                    {filteredReports.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center dark:text-white/30 text-dark/40 italic">No found reports matching search query.</td>
                      </tr>
                    ) : (
                      filteredReports.map(r => {
                        const hasLocation = r.location?.lat && r.location?.lng
                        return (
                          <tr key={r._id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4">
                              <div className="font-bold dark:text-white text-dark">{r.finderName}</div>
                              <div className="text-xs dark:text-white/40 text-dark/40 font-mono">{r.finderPhone}</div>
                              {r.finderEmail && <div className="text-xs dark:text-white/45 text-dark/40 font-mono truncate max-w-[150px]">{r.finderEmail}</div>}
                            </td>
                            <td className="p-4 max-w-xs">
                              <p className="dark:text-white/70 text-dark/60 italic leading-relaxed line-clamp-2">
                                "{r.message || 'No message left'}"
                              </p>
                              <div className="flex items-center gap-1 text-[10px] dark:text-white/30 text-dark/45 mt-1">
                                <Clock size={10} />
                                {formatDate(r.createdAt)}
                              </div>
                            </td>
                            <td className="p-4">
                              {hasLocation ? (
                                <a
                                  href={`https://www.google.com/maps?q=${r.location.lat},${r.location.lng}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-lime-theme font-semibold hover:underline"
                                >
                                  <MapPin size={12} /> Yes (View Maps)
                                </a>
                              ) : (
                                <span className="text-xs dark:text-white/30 text-dark/45">No Location</span>
                              )}
                            </td>
                            <td className="p-4">
                              {r.item ? (
                                <>
                                  <div className="font-semibold dark:text-white text-dark">{r.item.name}</div>
                                  <div className="text-xs dark:text-white/30 text-dark/40 font-mono">{r.item.itemId}</div>
                                </>
                              ) : (
                                <span className="text-red-400 font-bold">Deleted Item</span>
                              )}
                            </td>
                            <td className="p-4">
                              {r.owner ? (
                                <>
                                  <div className="font-semibold dark:text-white text-dark">{r.owner.name}</div>
                                  <div className="text-xs dark:text-white/35 text-dark/40 font-mono">{r.owner.email}</div>
                                </>
                              ) : (
                                <span className="dark:text-white/30 text-dark/45">N/A</span>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => openDeleteModal('report', r._id, `Report by ${r.finderName}`)}
                                className="btn-danger p-2 hover:bg-red-800/50 transition-all rounded-lg"
                                title="Delete Report"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Glassmorphic Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/70 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-md rounded-3xl p-6 border-2 shadow-2xl relative transition-all duration-300 scale-95 hover:scale-100"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <button
              onClick={closeDeleteModal}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 dark:text-white/50 text-dark/50 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 text-red-400 mb-4">
              <ShieldAlert size={28} />
              <h3 className="font-display font-extrabold text-xl">Confirm Destruction</h3>
            </div>

            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
              Are you sure you want to permanently delete the {deleteModal.type}{' '}
              <strong className="dark:text-white text-dark">"{deleteModal.name}"</strong>?
              {deleteModal.type === 'user' && (
                <span className="block mt-2 text-xs text-red-400/80 font-semibold bg-red-950/20 border border-red-900/30 p-3 rounded-xl">
                  ⚠️ WARNING: This will also permanently destroy all items registered by this user, along with any found reports submitted for them.
                </span>
              )}
              {deleteModal.type === 'item' && (
                <span className="block mt-2 text-xs text-red-400/80 font-semibold bg-red-950/20 border border-red-900/30 p-3 rounded-xl">
                  ⚠️ WARNING: This will permanently delete this item and destroy all associated lost found reports.
                </span>
              )}
            </p>

            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="btn-ghost flex-1 py-3 text-sm border font-semibold"
                style={{ borderColor: 'var(--border-color)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="btn-danger flex-1 py-3 text-sm font-bold flex justify-center items-center gap-2"
              >
                {deleting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Confirm Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
