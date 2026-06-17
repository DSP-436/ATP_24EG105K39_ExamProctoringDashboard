import { create } from 'zustand';
import {
  adminLogin,
  getStudents,
  getStats,
  getAnalytics,
  getStudentRankings,
  getViolationTrends,
  getPassFailDistribution,
} from '../services/adminService';

const useAdminStore = create((set) => ({
  admin: JSON.parse(localStorage.getItem('admin') || 'null'),
  token: localStorage.getItem('adminToken') || null,
  students: [],
  stats: null,
  analytics: null,
  rankings: [],
  violationTrends: [],
  passFailDistribution: [],
  loading: false,
  error: null,

  login: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await adminLogin(data);
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('admin', JSON.stringify(res.data.admin));
      set({ admin: res.data.admin, token: res.data.token, loading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed', loading: false });
      return false;
    }
  },

  fetchStudents: async () => {
    set({ loading: true });
    try {
      const res = await getStudents();
      set({ students: res.data.students, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchStats: async () => {
    try {
      const res = await getStats();
      set({ stats: res.data.stats });
    } catch {}
  },

  fetchAnalytics: async () => {
    try {
      const res = await getAnalytics();
      set({ analytics: res.data.analytics });
    } catch {}
  },

  fetchRankings: async () => {
    try {
      const res = await getStudentRankings();
      set({ rankings: res.data.rankings });
    } catch {}
  },

  fetchViolationTrends: async () => {
    try {
      const res = await getViolationTrends();
      set({ violationTrends: res.data.trends });
    } catch {}
  },

  fetchPassFailDistribution: async () => {
    try {
      const res = await getPassFailDistribution();
      set({ passFailDistribution: res.data.distribution });
    } catch {}
  },

  fetchAllAnalytics: async () => {
    set({ loading: true });
    await Promise.all([
      useAdminStore.getState().fetchStats(),
      useAdminStore.getState().fetchAnalytics(),
      useAdminStore.getState().fetchRankings(),
      useAdminStore.getState().fetchViolationTrends(),
      useAdminStore.getState().fetchPassFailDistribution(),
    ]);
    set({ loading: false });
  },

  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    set({ admin: null, token: null, stats: null, analytics: null, rankings: [], violationTrends: [], passFailDistribution: [] });
  },

  clearError: () => set({ error: null }),
}));

export default useAdminStore;
