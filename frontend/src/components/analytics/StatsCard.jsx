import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

const colorMap = {
  primary: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-200', value: 'text-blue-700' },
  success: { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-200', value: 'text-green-700' },
  warning: { bg: 'bg-yellow-50', icon: 'text-yellow-600', border: 'border-yellow-200', value: 'text-yellow-700' },
  danger: { bg: 'bg-red-50', icon: 'text-red-600', border: 'border-red-200', value: 'text-red-700' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-200', value: 'text-purple-700' },
  indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-200', value: 'text-indigo-700' },
  teal: { bg: 'bg-teal-50', icon: 'text-teal-600', border: 'border-teal-200', value: 'text-teal-700' },
};

export default function StatsCard({
  icon: Icon,
  label,
  value,
  color = 'primary',
  trend,
  subtitle,
  onClick,
}) {
  const c = colorMap[color] || colorMap.primary;

  const TrendIcon = trend > 0 ? FiTrendingUp : trend < 0 ? FiTrendingDown : FiMinus;
  const trendColor = trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-500' : 'text-gray-400';

  return (
    <div
      className={`card flex items-center gap-4 border-l-4 ${c.border} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className={`p-3 rounded-lg ${c.bg}`}>
        <Icon className={`text-2xl ${c.icon}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-2xl font-bold ${c.value}`}>{value ?? '—'}</p>
        <p className="text-sm text-gray-500 truncate">{label}</p>
        {(trend !== undefined || subtitle) && (
          <div className="flex items-center gap-2 mt-1">
            {trend !== undefined && (
              <span className={`flex items-center gap-0.5 text-xs ${trendColor}`}>
                <TrendIcon className="text-xs" />
                {Math.abs(trend)}%
              </span>
            )}
            {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
