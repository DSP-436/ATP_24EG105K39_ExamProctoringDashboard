import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getExamLogs } from '../../services/proctorService';
import Loader from '../common/Loader';
import { FiAlertTriangle } from 'react-icons/fi';

const severityColor = (s) => {
  switch (s) {
    case 'high': return 'text-red-600 bg-red-50 border-red-200';
    case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const activityLabel = (type) => {
  const labels = {
    tab_switch: 'Tab Switch',
    multiple_faces: 'Multiple Faces Detected',
    face_not_visible: 'Face Not Visible',
    looking_away: 'Looking Away',
    suspicious_audio: 'Suspicious Audio',
    copy_paste: 'Copy/Paste Detected',
    idle_timeout: 'Idle Timeout',
  };
  return labels[type] || type;
};

export default function SuspiciousLogs() {
  const { examId } = useParams();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getExamLogs(examId).then((res) => setLogs(res.data.logs)).catch(() => {}).finally(() => setLoading(false));
  }, [examId]);

  const filtered = filter === 'all' ? logs : logs.filter((l) => l.severity === filter);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Suspicious Activity Logs</h1>

      <div className="flex gap-2 mb-4">
        {['all', 'high', 'medium', 'low'].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize ${
            filter === s ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}>{s}</button>
        ))}
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No suspicious activities logged.</div>
        ) : (
          <div className="space-y-2">
            {filtered.map((log) => (
              <div key={log._id} className={`border rounded-lg p-4 ${severityColor(log.severity)}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <FiAlertTriangle className={log.severity === 'high' ? 'text-red-600' : 'text-yellow-600'} />
                      <span className="font-medium">{activityLabel(log.activityType)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full uppercase ${
                        log.severity === 'high' ? 'bg-red-100 text-red-700' : log.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                      }`}>{log.severity}</span>
                    </div>
                    <p className="text-sm mt-1">Student: {log.studentId?.name || 'Unknown'} ({log.studentId?.email || ''})</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
