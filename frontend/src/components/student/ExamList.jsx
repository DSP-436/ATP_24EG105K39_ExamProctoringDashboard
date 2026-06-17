import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiCalendar, FiBook } from 'react-icons/fi';
import useExamStore from '../../store/examStore';
import Loader from '../common/Loader';

export default function ExamList() {
  const { exams, fetchExams, loading } = useExamStore();

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Available Exams</h1>
      {loading ? (
        <Loader />
      ) : exams.length === 0 ? (
        <div className="card text-center py-12">
          <FiBook className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No exams available at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {exams.map((exam) => (
            <div key={exam._id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{exam.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{exam.description || 'No description'}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><FiClock /> {exam.duration} min</span>
                    <span className="flex items-center gap-1"><FiCalendar /> {new Date(exam.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} {new Date(exam.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(exam.endsAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} {new Date(exam.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>{exam.totalMarks} marks</span>
                  </div>
                </div>
                <Link to={`/student/exam/${exam._id}/instructions`} className="btn-primary ml-4 whitespace-nowrap">
                  Start Exam
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
