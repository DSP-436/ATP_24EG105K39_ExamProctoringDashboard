import { useState, useEffect } from 'react';
import { getAdminExams } from '../../services/examService';
import { getExamResults } from '../../services/adminService';
import { FiSearch, FiCheckCircle, FiXCircle, FiAlertTriangle } from 'react-icons/fi';
import Loader from '../common/Loader';

export default function Results() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resultsLoading, setResultsLoading] = useState(false);

  useEffect(() => {
    getAdminExams().then((res) => setExams(res.data.exams)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const fetchResults = async (examId) => {
    setSelectedExam(examId);
    if (!examId) return setResults([]);
    setResultsLoading(true);
    try {
      const res = await getExamResults(examId);
      setResults(res.data.results);
    } catch {} finally {
      setResultsLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Exam Results</h1>

      <div className="card mb-6">
        <label className="block text-sm font-medium mb-2">Select Exam</label>
        <div className="flex gap-2">
          <select value={selectedExam} onChange={(e) => fetchResults(e.target.value)} className="input-field">
            <option value="">Choose an exam...</option>
            {exams.map((e) => <option key={e._id} value={e._id}>{e.title}</option>)}
          </select>
        </div>
      </div>

      {resultsLoading ? (
        <Loader />
      ) : results.length > 0 ? (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-semibold">Student</th>
                <th className="pb-3 font-semibold">Score</th>
                <th className="pb-3 font-semibold">Percentage</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Suspicious</th>
                <th className="pb-3 font-semibold">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r._id} className="border-b last:border-0">
                  <td className="py-3">
                    <p className="font-medium">{r.studentId?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-400">{r.studentId?.email}</p>
                  </td>
                  <td className="py-3">{r.totalMarksObtained}</td>
                  <td className="py-3 font-bold">{r.percentage}%</td>
                  <td className="py-3">
                    <span className={`flex items-center gap-1 ${r.passed ? 'text-success-600' : 'text-danger-600'}`}>
                      {r.passed ? <FiCheckCircle /> : <FiXCircle />} {r.passed ? 'Pass' : 'Fail'}
                    </span>
                  </td>
                  <td className="py-3">
                    {r.isFlagged ? (
                      <span className="flex items-center gap-1 text-warning-600"><FiAlertTriangle /> {r.suspiciousCount}</span>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </td>
                  <td className="py-3 text-gray-500 text-xs">{new Date(r.submittedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : selectedExam ? (
        <div className="card text-center py-12 text-gray-500">No results for this exam.</div>
      ) : null}
    </div>
  );
}
