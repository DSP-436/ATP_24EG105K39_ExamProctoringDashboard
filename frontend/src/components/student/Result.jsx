import { useEffect, useState } from 'react';
import { getMyResults } from '../../services/adminService';
import { FiCheckCircle, FiXCircle, FiAlertTriangle } from 'react-icons/fi';
import Loader from '../common/Loader';

export default function Result() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyResults().then((res) => setResults(res.data.results)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Results</h1>
      {results.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No results yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((r) => (
            <div key={r._id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{r.examId?.title || 'Exam'}</h3>
                  <p className="text-sm text-gray-500">Submitted: {new Date(r.submittedAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${r.passed ? 'text-success-600' : 'text-danger-600'}`}>
                    {r.percentage}%
                  </p>
                  <p className="text-sm text-gray-500">{r.totalMarksObtained}/{r.examId?.totalMarks || 0} marks</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className={`flex items-center gap-1 ${r.passed ? 'text-success-600' : 'text-danger-600'}`}>
                  {r.passed ? <FiCheckCircle /> : <FiXCircle />} {r.passed ? 'Passed' : 'Failed'}
                </span>
                {r.isFlagged && (
                  <span className="flex items-center gap-1 text-warning-600">
                    <FiAlertTriangle /> Flagged ({r.suspiciousCount} alerts)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
