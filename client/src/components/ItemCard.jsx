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

  return (
    <div className="card card-hover p-5 group animate-fade-in">
      {/* Top row */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-50 to-blue-50 border border-primary-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-ink text-base leading-tight truncate">
            {item.name}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 capitalize">{item.category}</p>
          <p className="text-xs text-slate-400 mt-1">{format(item.createdAt)}</p>
        </div>
        <StatusBadge status={item.status} />
      </div>

      {/* Description */}
      {item.description && (
        <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <Link
          to={`/dashboard/item/${item._id}`}
          className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5"
        >
          <Eye size={13} /> View QR
        </Link>

        <button
          onClick={handleStatusToggle}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border transition-all duration-200
            bg-warn-50 text-warn-600 border-warn-200 hover:bg-warn-100"
        >
          <StatusIcon size={13} />
          {statusActionLabel}
        </button>

        <button
          onClick={() => onDelete(item._id, item.name)}
          className="btn-danger text-xs py-2 px-3 ml-auto"
          aria-label={`Delete ${item.name}`}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}

export default ItemCard
