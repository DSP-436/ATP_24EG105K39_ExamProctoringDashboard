import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiBook, FiFileText, FiAlertTriangle, FiActivity } from 'react-icons/fi';
import useAdminStore from '../../store/adminStore';
import Loader from '../common/Loader';

export default function AdminDashboard() {
  const { stats, fetchStats, loading } = useAdminStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading && !stats) return <Loader />;

  const s = stats || {};

  const cards = [
    { icon: FiUsers, label: 'Total Students', value: s.totalStudents || 0, color: 'bg-blue-100 text-blue-600' },
    { icon: FiBook, label: 'Active Exams', value: s.activeExams || 0, color: 'bg-green-100 text-green-600' },
    { icon: FiFileText, label: 'Total Results', value: s.totalResults || 0, color: 'bg-purple-100 text-purple-600' },
    { icon: FiAlertTriangle, label: 'Flagged Results', value: s.flaggedResults || 0, color: 'bg-red-100 text-red-600' },
    { icon: FiActivity, label: 'Suspicious Logs', value: s.totalLogs || 0, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card flex items-center gap-4">
              <div className={`p-3 rounded-lg ${card.color}`}>
                <Icon className="text-2xl" />
              </div>
              <div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-sm text-gray-500">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/exams/create" className="card hover:shadow-md transition-shadow flex items-center gap-4">
          <FiBook className="text-3xl text-primary-600" />
          <div>
            <h3 className="font-semibold">Create New Exam</h3>
            <p className="text-sm text-gray-500">Set up a new exam with questions and timing</p>
          </div>
        </Link>
        <Link to="/admin/analytics" className="card hover:shadow-md transition-shadow flex items-center gap-4">
          <FiActivity className="text-3xl text-primary-600" />
          <div>
            <h3 className="font-semibold">View Analytics</h3>
            <p className="text-sm text-gray-500">Detailed reports and suspicious activity analysis</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
