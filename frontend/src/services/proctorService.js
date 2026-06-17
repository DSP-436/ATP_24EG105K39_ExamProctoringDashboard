import api from './api';

export const logActivity = (data) => api.post('/proctor/log', data);
export const getExamLogs = (examId) => api.get(`/proctor/exam/${examId}`);
export const getStudentLogs = (studentId, examId) => api.get(`/proctor/student/${studentId}/exam/${examId}`);
export const sendHeartbeat = () => api.post('/proctor/heartbeat');
