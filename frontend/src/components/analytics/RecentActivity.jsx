import { FiActivity } from 'react-icons/fi';

export default function RecentActivity({ activities = [] }) {
  return (
    <div className="card">
      <h3 className="font-semibold mb-4 flex items-center gap-2"><FiActivity /> Recent Activity</h3>
      {activities.length === 0 ? (
        <p className="text-gray-500 text-center py-4 text-sm">No recent activity.</p>
      ) : (
        <div className="space-y-3">
          {activities.slice(0, 10).map((a, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{a._id || a.activityType || 'Event'}</span>
              <span className="font-medium">{a.count || 0}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
