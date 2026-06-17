export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (value) => {
  if (typeof value === 'string') return value.trim().length > 0;
  return value !== null && value !== undefined;
};

export const validateExamForm = (form) => {
  const errors = {};
  if (!validateRequired(form.title)) errors.title = 'Title is required';
  if (!form.duration || form.duration < 1) errors.duration = 'Duration must be at least 1 minute';
  if (!form.totalMarks || form.totalMarks < 1) errors.totalMarks = 'Total marks must be at least 1';
  if (!form.scheduledAt) errors.scheduledAt = 'Scheduled date is required';
  if (!form.endsAt) errors.endsAt = 'End date is required';
  return errors;
};
