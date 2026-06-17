import { useEffect, useState } from 'react';
import { FiAlertTriangle, FiXCircle } from 'react-icons/fi';

const LEVEL_CONFIG = {
  soft: {
    title: 'Warning',
    bg: 'bg-warning-500',
    text: 'text-white',
    timeout: 3000,
  },
  hard: {
    title: 'Serious Violation',
    bg: 'bg-danger-600',
    text: 'text-white',
    timeout: 5000,
  },
  auto_submit: {
    title: 'Exam Auto-Submitted',
    bg: 'bg-red-700',
    text: 'text-white',
    timeout: 0,
  },
};

export default function ProctorWarning({ level, violations, onDismiss, onAutoSubmit }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!level) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const config = LEVEL_CONFIG[level] || LEVEL_CONFIG.soft;

    if (config.timeout > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, config.timeout);
      return () => clearTimeout(timer);
    }
  }, [level, onDismiss]);

  if (!visible || !level) return null;

  const config = LEVEL_CONFIG[level] || LEVEL_CONFIG.soft;
  const isAutoSubmit = level === 'auto_submit';

  const violationList = Object.entries(violations)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
      <div className={`${config.bg} ${config.text} rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6`}>
        <div className="text-center">
          {isAutoSubmit ? (
            <FiXCircle className="text-5xl mx-auto mb-3" />
          ) : (
            <FiAlertTriangle className="text-5xl mx-auto mb-3" />
          )}
          <h2 className="text-xl font-bold mb-2">{config.title}</h2>
          <p className="opacity-90 mb-4">
            {isAutoSubmit
              ? 'Excessive violations detected. Your exam has been automatically submitted.'
              : 'Suspicious activity has been detected and logged.'}
          </p>
        </div>

        {violationList.length > 0 && (
          <div className="bg-black/20 rounded-lg p-3 mb-4">
            <p className="text-sm font-semibold mb-2">Violation Summary:</p>
            {violationList.map(([type, count]) => (
              <div key={type} className="flex justify-between text-sm py-0.5">
                <span>{type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                <span className="font-bold">{count}</span>
              </div>
            ))}
          </div>
        )}

        {isAutoSubmit ? (
          <button
            onClick={onAutoSubmit}
            className="w-full py-2.5 bg-white text-red-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            OK
          </button>
        ) : (
          <button
            onClick={() => { setVisible(false); onDismiss?.(); }}
            className="w-full py-2.5 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-colors"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
