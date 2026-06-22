const STATUS_CONFIG = {
  active: {
    label: 'Active',
    className: 'bg-lime/15 text-lime border border-lime/30',
    dot: 'bg-lime animate-pulse',
  },
  lost: {
    label: 'Lost',
    className: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
    dot: 'bg-orange-400 animate-pulse',
  },
  recovered: {
    label: 'Recovered',
    className: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    dot: 'bg-blue-400',
  },
}

const StatusBadge = ({ status, size = 'sm' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.active
  const sizeClass = size === 'lg' ? 'px-4 py-1.5 text-sm' : 'px-3 py-1 text-xs'

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${sizeClass} ${config.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}

export default StatusBadge
