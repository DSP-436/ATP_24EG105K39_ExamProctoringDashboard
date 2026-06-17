import api from './api';

export const registerStudent = (data) => api.post('/auth/register', data);
export const loginStudent = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');
