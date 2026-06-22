import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import Navbar from '../components/Navbar'
import ItemCard from '../components/ItemCard'
import { SkeletonGrid } from '../components/SkeletonCard'
import { Plus, Package, AlertTriangle, CheckCircle, Bell, Scan } from 'lucide-react'
import toast from 'react-hot-toast'

const StatCard = ({ icon, label, value, variant = 'dark' }) => {
  const isLime = variant === 'lime'
  const isLight = variant === 'light'
  return (
    <div className={`rounded-2xl p-5 flex items-center gap-4 border-2 transition-all hover:-translate-y-1 duration-300 ${
      isLime ? 'bg-lime border-lime' :
      isLight ? 'bg-card-light border-black/10' :
      'bg-card-dark border-white/10'
    }`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
        isLime ? 'bg-dark text-lime' : 'bg-lime/10 text-lime'
      }`}>
        {icon}
      </div>
      <div>
        <div className={`text-2xl font-bold font-display ${isLime ? 'text-dark' : 'text-white'}`}>{value}</div>
        <div className={`text-xs font-medium ${isLime ? 'text-dark/60' : 'text-white/40'}`}>{label}</div>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [filter, setFilter] = useState('all')

  const fetchItems = async () => {
    try {
      const { data } = await api.get('/api/items')
      setItems(data.items)
    } catch {
      toast.error('Failed to load items.')
    } finally {
      setLoading(false)
    }
  }

  const fetchUnread = async () => {
    try {
      const { data } = await api.get('/api/items/notifications/all')
      setUnreadCount(data.reports.filter(r => !r.isRead).length)
    } catch {/* silent */}
  }

  useEffect(() => {
    fetchItems()
    fetchUnread()
  }, [])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await api.delete(`/api/items/${id}`)
      setItems(prev => prev.filter(i => i._id !== id))
      toast.success(`"${name}" deleted.`)
    } catch {
      toast.error('Failed to delete item.')
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { data } = await api.patch(`/api/items/${id}/status`, { status: newStatus })
      setItems(prev => prev.map(i => i._id === id ? data.item : i))
      const labels = { lost: '⚠️ Marked as Lost', recovered: '✅ Marked as Recovered', active: 'Set to Active' }
      toast.success(labels[newStatus] || 'Status updated.')
    } catch {
      toast.error('Failed to update status.')
    }
  }

  const stats = {
    total: items.length,
    active: items.filter(i => i.status === 'active').length,
    lost: items.filter(i => i.status === 'lost').length,
    recovered: items.filter(i => i.status === 'recovered').length,
  }

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter)

  return (
    <div className="min-h-screen bg-dark">
      <Navbar unreadCount={unreadCount} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="section-tag mb-3 inline-block">Dashboard</span>
            <h1 className="font-display text-3xl font-bold text-white">
              Hi, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-white/40 mt-1">
              {items.length === 0
                ? "You haven't added any items yet."
                : `Managing ${items.length} item${items.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard/notifications" className="relative btn-ghost px-4 py-2.5 text-sm border border-white/10">
              <Bell size={16} />
              Alerts
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-lime text-dark text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link to="/dashboard/add-item" className="btn-primary text-sm">
              <Plus size={16} /> Add Item
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Package size={20} />} label="Total Items" value={stats.total} variant="dark" />
          <StatCard icon={<CheckCircle size={20} />} label="Active" value={stats.active} variant="lime" />
          <StatCard icon={<AlertTriangle size={20} />} label="Lost" value={stats.lost} variant="dark" />
          <StatCard icon={<Scan size={20} />} label="Recovered" value={stats.recovered} variant="dark" />
        </div>

        {/* Filter tabs */}
        {items.length > 0 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {['all', 'active', 'lost', 'recovered'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 capitalize border-2 ${
                  filter === f
                    ? 'bg-lime text-dark border-lime'
                    : 'bg-transparent text-white/60 border-white/10 hover:border-lime/40 hover:text-lime'
                }`}
              >
                {f === 'all' ? `All (${stats.total})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${stats[f]})`}
              </button>
            ))}
          </div>
        )}

        {/* Items grid */}
        {loading ? (
          <SkeletonGrid count={3} />
        ) : filtered.length === 0 ? (
          <div className="bg-card-dark border-2 border-white/10 rounded-3xl p-16 text-center">
            <div className="text-6xl mb-4">{items.length === 0 ? '📦' : '🔍'}</div>
            <h3 className="font-display text-xl font-bold text-white mb-2">
              {items.length === 0 ? 'No items yet' : `No ${filter} items`}
            </h3>
            <p className="text-white/40 mb-6">
              {items.length === 0
                ? "Add your first item to generate a QR code and start protecting it."
                : "Change the filter to see other items."}
            </p>
            {items.length === 0 && (
              <Link to="/dashboard/add-item" className="btn-primary inline-flex">
                <Plus size={16} /> Add Your First Item
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(item => (
              <ItemCard
                key={item._id}
                item={item}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard
