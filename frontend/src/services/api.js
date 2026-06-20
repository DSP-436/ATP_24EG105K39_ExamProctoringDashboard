import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://atp-24eg105k39-examproctoringdashboard.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      window.location.href = isAdminRoute ? '/admin/login' : '/student/login';
    }
    return Promise.reject(error);
  }
);

export default api;
