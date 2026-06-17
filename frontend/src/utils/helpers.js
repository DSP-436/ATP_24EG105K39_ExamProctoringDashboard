import { SEVERITY_WEIGHTS } from './constants';

export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export const truncate = (str, len = 100) => {
  if (!str || str.length <= len) return str || '';
  return str.substring(0, len) + '...';
};

export const classNames = (...classes) => classes.filter(Boolean).join(' ');

export const getSeverityWeight = (severity) => SEVERITY_WEIGHTS[severity] || 1;

export const getViolationScore = (violations) =>
  Object.entries(violations).reduce((sum, [, count]) => sum + count, 0);

export const getWeightedViolationScore = (violations, activityTypes) => {
  let score = 0;
  Object.entries(violations).forEach(([type, count]) => {
    const activity = activityTypes.find((a) => a.value === type);
    const weight = activity ? SEVERITY_WEIGHTS[activity.severity] : 1;
    score += count * weight;
  });
  return score;
};

export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
