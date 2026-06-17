import api from './api';

export const adminLogin = (data) => api.post('/admin/login', data);
export const getStudents = () => api.get('/admin/students');
export const toggleStudentStatus = (id) => api.put(`/admin/student/${id}/toggle-status`);
export const getStats = () => api.get('/admin/stats');
export const getAnalytics = () => api.get('/admin/analytics');
export const getStudentRankings = () => api.get('/admin/rankings');
export const getViolationTrends = () => api.get('/admin/violation-trends');
export const getPassFailDistribution = () => api.get('/admin/pass-fail-distribution');

export const getQuestionsByExam = (examId) => api.get(`/questions/exam/${examId}`);
export const createQuestion = (data) => api.post('/questions', data);
export const bulkCreateQuestions = (data) => api.post('/questions/bulk', data);
export const updateQuestion = (id, data) => api.put(`/questions/${id}`, data);
export const deleteQuestion = (id) => api.delete(`/questions/${id}`);

export const getExamResults = (examId) => api.get(`/results/exam/${examId}`);
export const getStudentResults = (studentId) => api.get(`/results/student/${studentId}`);
export const getMyResults = () => api.get('/results/my-results');
export const getResultById = (id) => api.get(`/results/${id}`);
export const getAdminExamById = (id) => api.get(`/exams/admin/${id}`);