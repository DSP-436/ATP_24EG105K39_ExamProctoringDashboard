import api from './api';

export const getExams = () => api.get('/exams');
export const getAdminExams = () => api.get('/exams/admin');
export const getExamById = (id) => api.get(`/exams/${id}`);
export const createExam = (data) => api.post('/exams', data);
export const updateExam = (id, data) => api.put(`/exams/${id}`, data);
export const deleteExam = (id) => api.delete(`/exams/${id}`);
export const submitExam = (data) => api.post('/results/submit', data);
