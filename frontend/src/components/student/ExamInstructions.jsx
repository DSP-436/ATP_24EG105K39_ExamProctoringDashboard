import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiAlertTriangle, FiMonitor, FiCamera, FiEye } from 'react-icons/fi';
import useExamStore from '../../store/examStore';
import Loader from '../common/Loader';

export default function ExamInstructions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentExam, fetchExamById, loading, error } = useExamStore();
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    fetchExamById(id);
  }, [id, fetchExamById]);

  if (loading) return <Loader />;
  if (error) return <div className="card text-danger-600">{error}</div>;
  if (!currentExam) return null;

  const startExam = () => navigate(`/student/exam/${id}/play`);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card mb-6">
        <h1 className="text-2xl font-bold mb-2">{currentExam.title}</h1>
        <p className="text-gray-500">{currentExam.description}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card text-center">
          <p className="text-2xl font-bold text-primary-600">{currentExam.duration}</p>
          <p className="text-sm text-gray-500">Minutes</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-primary-600">{currentExam.totalMarks}</p>
          <p className="text-sm text-gray-500">Total Marks</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-primary-600">{currentExam.questions?.length || 0}</p>
          <p className="text-sm text-gray-500">Questions</p>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-3">Instructions</h2>
        <div className="prose prose-sm max-w-none text-gray-600">
          {currentExam.instructions ? (
            <p>{currentExam.instructions}</p>
          ) : (
            <ul className="list-disc pl-5 space-y-2">
              <li>Ensure you have a stable internet connection.</li>
              <li>Grant camera and microphone permissions when prompted.</li>
              <li>Do not switch tabs or open other applications during the exam.</li>
              <li>Ensure you are alone in the room with adequate lighting.</li>
              <li>Once started, the timer cannot be paused.</li>
            </ul>
          )}
        </div>
      </div>

      <div className="card mb-6 bg-warning-50 border-warning-200 border">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-warning-600">
          <FiAlertTriangle /> Proctoring Notice
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <FiCamera className="mt-0.5 text-primary-600" />
            <span>Webcam will be used for face detection and monitoring.</span>
          </div>
          <div className="flex items-start gap-2">
            <FiMonitor className="mt-0.5 text-primary-600" />
            <span>Tab switching will be detected and logged.</span>
          </div>
          <div className="flex items-start gap-2">
            <FiEye className="mt-0.5 text-primary-600" />
            <span>Multiple persons in frame will trigger an alert.</span>
          </div>
          <div className="flex items-start gap-2">
            <FiAlertTriangle className="mt-0.5 text-danger-600" />
            <span>Suspicious activities will be reported to the admin.</span>
          </div>
        </div>
      </div>

      <label className="flex items-start gap-3 mb-6 cursor-pointer">
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1" />
        <span className="text-sm text-gray-600">
          I have read and agree to the proctoring rules. I understand that any suspicious activity may result in disqualification.
        </span>
      </label>

      <button onClick={startExam} disabled={!agreed} className="btn-primary w-full py-3 text-lg">
        Start Exam
      </button>
    </div>
  );
}
