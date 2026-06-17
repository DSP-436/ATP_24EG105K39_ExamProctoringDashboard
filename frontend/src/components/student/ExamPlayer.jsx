import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useExamStore from '../../store/examStore';
import useProctorStore from '../../store/proctorStore';
import useWebcam from '../../hooks/useWebcam';
import useFaceDetection from '../../hooks/useFaceDetection';
import useTabDetection from '../../hooks/useTabDetection';
import useFullScreen from '../../hooks/useFullScreen';
import useTimer from '../../hooks/useTimer';
import ProctorWarning from '../proctor/ProctorWarning';
import ProctorStatusBar from '../proctor/ProctorStatusBar';
import { FiCamera, FiAlertTriangle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Loader from '../common/Loader';

export default function ExamPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentExam, fetchExamById, answers, setAnswer, submitExam, loading } = useExamStore();
  const proctor = useProctorStore();
  const {
    logSuspiciousActivity, incrementViolation, setFaceStatus, setHeadPose, setIsFullScreen,
    warningLevel, clearWarning, shouldAutoSubmit, violations, startMonitoring, stopMonitoring,
  } = proctor;

  const { videoRef, isActive: camActive, error: camError, start: startCam, stop: stopCam } = useWebcam();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const faceLogRef = useRef(0);
  const poseLogRef = useRef(0);
  const [showSidebar, setShowSidebar] = useState(true);

  const handleSubmitRef = useRef(null);
  handleSubmitRef.current = async () => {
    if (submitting) return;
    setSubmitting(true);

    const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer: String(answer),
    }));

    const result = await submitExam({ examId: id, answers: answersArray });
    setSubmitting(false);

    if (result) {
      stopCam();
      toast.success('Exam submitted successfully!');
      navigate('/student/results');
    } else {
      toast.error('Failed to submit exam. Please try again.');
    }
  };

  const handleSubmit = () => handleSubmitRef.current?.();

  const handleExpire = useCallback(async () => {
    toast.warning('Time is up! Submitting your exam...');
    await handleSubmitRef.current?.();
  }, []);

  const timer = useTimer({
    duration: currentExam?.duration || 0,
    onExpire: handleExpire,
    startImmediately: true,
  });

  const handleTabSwitch = useCallback(() => {
    incrementViolation('tab_switch', 'high');
    logSuspiciousActivity({ examId: id, activityType: 'tab_switch', severity: 'high', details: { timestamp: new Date() } });
  }, [id, incrementViolation, logSuspiciousActivity]);

  const handleMinimize = useCallback(() => {
    incrementViolation('browser_minimize', 'high');
    logSuspiciousActivity({ examId: id, activityType: 'browser_minimize', severity: 'high', details: { timestamp: new Date() } });
  }, [id, incrementViolation, logSuspiciousActivity]);

  const handleScreenshot = useCallback(() => {
    incrementViolation('screenshot_attempt', 'high');
    logSuspiciousActivity({ examId: id, activityType: 'screenshot_attempt', severity: 'high', details: { timestamp: new Date() } });
  }, [id, incrementViolation, logSuspiciousActivity]);

  const handleRightClick = useCallback(() => {
    incrementViolation('right_click', 'high');
    logSuspiciousActivity({ examId: id, activityType: 'right_click', severity: 'high', details: { timestamp: new Date() } });
  }, [id, incrementViolation, logSuspiciousActivity]);

  const handleDevTools = useCallback(() => {
    incrementViolation('devtools_open', 'high');
    logSuspiciousActivity({ examId: id, activityType: 'devtools_open', severity: 'high', details: { timestamp: new Date() } });
  }, [id, incrementViolation, logSuspiciousActivity]);

  const handleFullScreenExit = useCallback(() => {
    setIsFullScreen(false);
    incrementViolation('fullscreen_exit', 'high');
    logSuspiciousActivity({ examId: id, activityType: 'fullscreen_exit', severity: 'high', details: { timestamp: new Date() } });
  }, [id, incrementViolation, logSuspiciousActivity, setIsFullScreen]);

  const handleFullScreenChange = useCallback((isFs) => {
    setIsFullScreen(isFs);
  }, [setIsFullScreen]);

  useFullScreen({ onExit: handleFullScreenExit, enabled: true });

  useTabDetection({
    onTabSwitch: handleTabSwitch,
    onMinimize: handleMinimize,
    onScreenshotAttempt: handleScreenshot,
    onRightClick: handleRightClick,
    onDevToolsOpen: handleDevTools,
    enabled: true,
  });

  const handleFaceDetected = useCallback(({ status }) => {
    setFaceStatus(status);

    if (status === 'not_visible') {
      faceLogRef.current += 1;
      if (faceLogRef.current % 5 === 0) {
        incrementViolation('face_not_visible', 'medium');
        logSuspiciousActivity({ examId: id, activityType: 'face_not_visible', severity: 'medium', details: { count: faceLogRef.current } });
      }
    }
  }, [id, incrementViolation, logSuspiciousActivity, setFaceStatus]);

  const handleMultipleFaces = useCallback((detected) => {
    if (detected) {
      incrementViolation('multiple_faces', 'high');
      logSuspiciousActivity({ examId: id, activityType: 'multiple_faces', severity: 'high', details: { timestamp: new Date() } });
    }
  }, [id, incrementViolation, logSuspiciousActivity]);

  const poseStatusRef = useRef('center');

  const handleHeadPose = useCallback(({ yaw, pitch, status }) => {
    setHeadPose({ yaw, pitch, status });

    if (status !== 'center' && status !== poseStatusRef.current) {
      poseLogRef.current += 1;
      const activityType = status === 'down' ? 'head_down'
        : status === 'left' ? 'looking_left'
        : status === 'right' ? 'looking_right'
        : 'looking_away';
      incrementViolation(activityType, 'medium');
      logSuspiciousActivity({ examId: id, activityType, severity: 'medium', details: { yaw, pitch } });
    }
    poseStatusRef.current = status;
  }, [id, incrementViolation, logSuspiciousActivity, setHeadPose]);

  const { canvasRef } = useFaceDetection({
    videoRef,
    onFaceDetected: handleFaceDetected,
    onMultipleFaces: handleMultipleFaces,
    onHeadPose: handleHeadPose,
    interval: 2000,
  });

  useEffect(() => {
    startMonitoring();
    fetchExamById(id);
    startCam();

    return () => {
      stopMonitoring();
      stopCam();
    };
  }, [id]);

  useEffect(() => {
    if (shouldAutoSubmit) {
      handleSubmit();
    }
  }, [shouldAutoSubmit]);

  const handleAnswer = (questionId, value) => setAnswer(questionId, value);

  const handleWarningDismiss = () => clearWarning();

  if (loading || !currentExam) return <Loader />;

  const questions = currentExam.questions || [];
  const currentQuestion = questions[currentIndex];
  const selectedAnswer = answers[currentQuestion?._id] || '';

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <ProctorWarning
        level={warningLevel}
        violations={violations}
        onDismiss={handleWarningDismiss}
        onAutoSubmit={handleWarningDismiss}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold truncate">{currentExam.title}</h1>
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 px-4 py-1.5 rounded-lg">
              <span className="text-xl font-bold font-mono">{timer.formatted}</span>
            </div>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
            >
              <FiCamera className="text-lg" />
            </button>
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary text-sm">
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-2 mb-4 flex gap-1.5 overflow-x-auto">
              {questions.map((q, i) => {
                const isAnswered = answers[q._id];
                return (
                  <button
                    key={q._id}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-9 h-9 rounded text-sm font-medium shrink-0 transition-colors ${
                      i === currentIndex
                        ? 'bg-primary-600 text-white'
                        : isAnswered
                        ? 'bg-success-100 text-success-700'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            {currentQuestion && (
              <div className="card">
                <p className="text-sm text-gray-500 mb-2">
                  Question {currentIndex + 1} of {questions.length}
                  <span className="mx-2">&middot;</span>
                  {currentQuestion.marks} marks
                </p>
                <h3 className="text-lg font-medium mb-5">{currentQuestion.questionText}</h3>

                {currentQuestion.questionType === 'mcq' && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, i) => (
                      <label
                        key={i}
                        className={`block p-3.5 rounded-lg border cursor-pointer transition-all ${
                          selectedAnswer === option
                            ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                            : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${currentQuestion._id}`}
                          value={option}
                          checked={selectedAnswer === option}
                          onChange={() => handleAnswer(currentQuestion._id, option)}
                          className="mr-3"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}

                {currentQuestion.questionType === 'true_false' && (
                  <div className="flex gap-4">
                    {['True', 'False'].map((opt) => (
                      <label
                        key={opt}
                        className={`flex-1 p-4 rounded-lg border cursor-pointer text-center font-medium transition-all ${
                          selectedAnswer === opt
                            ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${currentQuestion._id}`}
                          value={opt}
                          checked={selectedAnswer === opt}
                          onChange={() => handleAnswer(currentQuestion._id, opt)}
                          className="mr-2"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                )}

                {currentQuestion.questionType === 'short_answer' && (
                  <textarea
                    value={selectedAnswer}
                    onChange={(e) => handleAnswer(currentQuestion._id, e.target.value)}
                    className="input-field min-h-[120px] resize-y"
                    placeholder="Type your answer here..."
                  />
                )}
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="btn-outline flex items-center gap-1"
              >
                <FiChevronLeft /> Previous
              </button>
              <button
                onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
                disabled={currentIndex === questions.length - 1}
                className="btn-primary flex items-center gap-1"
              >
                Next <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSidebar && (
        <div className="w-72 bg-white shadow-lg border-l flex flex-col">
          <div className="p-4 border-b">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <FiCamera /> Live Monitoring
            </h3>
          </div>

          <div className="relative bg-gray-900 mx-4 mt-4 rounded-lg overflow-hidden aspect-[4/3]">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            {!camActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <div className="text-center text-white text-sm">
                  <FiAlertTriangle className="text-2xl mx-auto mb-2 text-danger-400" />
                  {camError || 'Camera not active'}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            <div className="mb-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Timer</span>
                <span className="font-mono font-bold">{timer.formatted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Progress</span>
                <span>{Math.round(timer.progress)}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${timer.progress}%` }}
                />
              </div>
            </div>

            <ProctorStatusBar store={useProctorStore} />
          </div>
        </div>
      )}
    </div>
  );
}
