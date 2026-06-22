import { Link } from 'react-router-dom'
import { Eye, Trash2, AlertTriangle, CheckCircle, RotateCcw } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { CATEGORY_ICONS } from './QRCard'
import { format } from '../utils/dateFormat'

const ItemCard = ({ item, onDelete, onStatusChange }) => {
  const icon = CATEGORY_ICONS[item.category] || '📦'

  const handleStatusToggle = () => {
    if (item.status === 'active') {
      onStatusChange(item._id, 'lost')
    } else if (item.status === 'lost') {
      onStatusChange(item._id, 'recovered')
    } else {
      onStatusChange(item._id, 'active')
    }
  }

  const statusActionLabel = {
    active: 'Mark as Lost',
    lost: 'Mark Recovered',
    recovered: 'Set Active',
  }[item.status]

  const StatusIcon = {
    active: AlertTriangle,
    lost: CheckCircle,
    recovered: RotateCcw,
  }[item.status]

  const statusColors = {
    active: 'bg-lime/10 text-lime border-lime/20 hover:bg-lime/20',
    lost: 'bg-orange-900/20 text-orange-500 border-orange-400/30 hover:bg-orange-900/30',
    recovered: 'dark:bg-white/5 bg-dark/5 dark:text-white/60 text-dark/50 dark:border-white/10 border-dark/10 dark:hover:bg-white/10 hover:bg-dark/10',
  }

  return (
    <div
      className="border-2 rounded-2xl p-5 group animate-fade-in hover:-translate-y-1 transition-all duration-300 card-glow"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
    >
      {/* Top row */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-lime/10 border border-lime/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 group-hover:bg-lime/20 transition-all duration-300">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold dark:text-white text-dark text-base leading-tight truncate">
            {item.name}
          </h3>
          <p className="text-xs dark:text-white/40 text-dark/50 mt-0.5 capitalize">{item.category}</p>
          <p className="text-xs dark:text-white/25 text-dark/30 mt-1">{format(item.createdAt)}</p>
        </div>
        <StatusBadge status={item.status} />
      </div>

      {/* Description */}
      {item.description && (
        <p className="text-sm dark:text-white/40 text-dark/50 mb-4 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <Link
          to={`/dashboard/item/${item._id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border-2 border-lime/30 text-lime bg-lime/10 hover:bg-lime hover:text-dark transition-all duration-200"
        >
          <Eye size={13} /> View QR
        </Link>

        <button
          onClick={handleStatusToggle}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border-2 transition-all duration-200 ${statusColors[item.status]}`}
        >
          <StatusIcon size={13} />
          {statusActionLabel}
        </button>

        <button
          onClick={() => onDelete(item._id, item.name)}
          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl border-2 border-red-800/30 bg-red-900/20 text-red-400 hover:bg-red-900/40 transition-all duration-200 ml-auto"
          aria-label={`Delete ${item.name}`}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}

export default ItemCard
