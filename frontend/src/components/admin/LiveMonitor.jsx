import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { getExamLogs } from '../../services/proctorService';
import { BiRadio } from 'react-icons/bi';
import { FiAlertTriangle, FiUser, FiClock, FiEye } from 'react-icons/fi';
import Loader from '../common/Loader';

export default function LiveMonitor() {
  const { examId } = useParams();
  const [logs, setLogs] = useState([]);
  const [liveEvents, setLiveEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  useEffect(() => {
    getExamLogs(examId).then((res) => setLogs(res.data.logs)).catch(() => {}).finally(() => setLoading(false));

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'https://atp-24eg105k39-examproctoringdashboard.onrender.com';
    socketRef.current = io(socketUrl, { transports: ['websocket'] });
    socketRef.current.emit('join:exam', examId);

    socketRef.current.on('proctor:alert', (data) => {
      setLiveEvents((prev) => [data, ...prev].slice(0, 50));
    });

    return () => {
      socketRef.current?.emit('leave:exam', examId);
      socketRef.current?.disconnect();
    };
  }, [examId]);

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
      multiple_faces: 'Multiple Faces',
      face_not_visible: 'Face Not Visible',
      looking_away: 'Looking Away',
      suspicious_audio: 'Suspicious Audio',
      copy_paste: 'Copy/Paste',
      idle_timeout: 'Idle Timeout',
    };
    return labels[type] || type;
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Live Monitoring</h1>
        {liveEvents.length > 0 && (
          <span className="flex items-center gap-1 text-danger-600 animate-pulse"><BiRadio className="text-lg" /> Live</span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><FiAlertTriangle /> Live Alerts ({liveEvents.length})</h2>
            {liveEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No live alerts. Waiting for events...</p>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {liveEvents.map((event, i) => (
                  <div key={i} className={`border rounded-lg p-3 text-sm ${severityColor(event.severity)}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{activityLabel(event.activityType)}</span>
                      <span className="text-xs">{new Date(event.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-xs mt-1">Student: {event.studentId} &middot; Severity: {event.severity}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="card">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><FiClock /> Recent Logs</h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {logs.slice(0, 50).map((log) => (
                <div key={log._id} className={`border rounded-lg p-2 text-xs ${severityColor(log.severity)}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{activityLabel(log.activityType)}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="mt-0.5">{log.studentId?.name || 'Unknown'}</p>
                </div>
              ))}
              {logs.length === 0 && <p className="text-gray-500 text-center py-4">No logs yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
