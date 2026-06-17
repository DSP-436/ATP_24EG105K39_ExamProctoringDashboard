import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiFileText, FiCheckCircle, FiClock } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import useExamStore from '../../store/examStore';
import Loader from '../common/Loader';

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const { exams, fetchExams, loading } = useExamStore();

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const upcomingExams = exams.filter((e) => new Date(e.scheduledAt) > new Date());
  const availableExams = exams.filter((e) => new Date(e.scheduledAt) <= new Date() && new Date(e.endsAt) >= new Date());

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-gray-500">Student Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg"><FiBook className="text-2xl text-primary-600" /></div>
          <div><p className="text-2xl font-bold">{availableExams.length}</p><p className="text-sm text-gray-500">Available Exams</p></div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg"><FiCheckCircle className="text-2xl text-success-600" /></div>
          <div><p className="text-2xl font-bold">{upcomingExams.length}</p><p className="text-sm text-gray-500">Upcoming</p></div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-orange-100 rounded-lg"><FiClock className="text-2xl text-warning-600" /></div>
          <div><p className="text-2xl font-bold">{exams.length}</p><p className="text-sm text-gray-500">Total Exams</p></div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Available Exams</h2>
          <Link to="/student/exams" className="text-sm text-primary-600 hover:underline">View All</Link>
        </div>
        {loading ? (
          <Loader />
        ) : availableExams.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No exams available right now.</p>
        ) : (
          <div className="divide-y">
            {availableExams.slice(0, 5).map((exam) => (
              <div key={exam._id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{exam.title}</p>
                    <p className="text-sm text-gray-500">{exam.duration} min &middot; {exam.totalMarks} marks</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(exam.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} {new Date(exam.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(exam.endsAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} {new Date(exam.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                <Link to={`/student/exam/${exam._id}/instructions`} className="btn-primary text-sm px-4 py-1.5">
                  Start
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
