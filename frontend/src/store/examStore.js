import { create } from 'zustand';
import { getExams, getExamById, submitExam } from '../services/examService';

const useExamStore = create((set, get) => ({
  exams: [],
  currentExam: null,
  answers: {},
  loading: false,
  submitting: false,
  error: null,

  fetchExams: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getExams();
      set({ exams: res.data.exams, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch exams', loading: false });
    }
  },

  fetchExamById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await getExamById(id);
      set({ currentExam: res.data.exam, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch exam', loading: false });
    }
  },

  setAnswer: (questionId, answer) => {
    set((state) => ({ answers: { ...state.answers, [questionId]: answer } }));
  },

  submitExam: async (data) => {
    set({ submitting: true, error: null });
    try {
      const res = await submitExam(data);
      set({ submitting: false, answers: {}, currentExam: null });
      return res.data.result;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to submit exam', submitting: false });
      return null;
    }
  },

  resetExam: () => set({ currentExam: null, answers: {}, error: null }),
}));

export default useExamStore;
