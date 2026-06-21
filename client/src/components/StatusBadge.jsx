const STATUS_CONFIG = {
  active: {
    label: 'Active',
    className: 'bg-accent-100 text-accent-600 border border-accent-200',
    dot: 'bg-accent-500',
  },
  lost: {
    label: 'Lost',
    className: 'bg-warn-100 text-warn-600 border border-warn-200',
    dot: 'bg-warn-500',
  },
  recovered: {
    label: 'Recovered',
    className: 'bg-primary-100 text-primary-700 border border-primary-200',
    dot: 'bg-primary-600',
  },
}

const StatusBadge = ({ status, size = 'sm' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.active
  const sizeClass = size === 'lg' ? 'px-4 py-1.5 text-sm' : 'px-3 py-1 text-xs'

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${sizeClass} ${config.className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}

export default StatusBadge
