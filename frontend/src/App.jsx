import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import StudentLayout from './components/layout/StudentLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

import StudentLogin from './components/student/Login';
import StudentRegister from './components/student/Register';
import StudentDashboard from './components/student/Dashboard';
import ExamList from './components/student/ExamList';
import ExamInstructions from './components/student/ExamInstructions';
import ExamPlayer from './components/student/ExamPlayer';
import Result from './components/student/Result';

import AdminLogin from './components/admin/Login';
import AdminDashboard from './components/admin/Dashboard';
import CreateExam from './components/admin/CreateExam';
import ManageQuestions from './components/admin/ManageQuestions';
import LiveMonitor from './components/admin/LiveMonitor';
import SuspiciousLogs from './components/admin/SuspiciousLogs';
import Results from './components/admin/Results';
import Analytics from './components/admin/Analytics';
import StudentManagement from './components/admin/StudentManagement';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/student/login" replace />} />

      <Route path="/student/login" element={<StudentLogin />} />
      <Route path="/student/register" element={<StudentRegister />} />
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute>
            <StudentLayout>
              <StudentDashboard />
            </StudentLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/exams"
        element={
          <ProtectedRoute>
            <StudentLayout>
              <ExamList />
            </StudentLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/exam/:id/instructions"
        element={
          <ProtectedRoute>
            <StudentLayout>
              <ExamInstructions />
            </StudentLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/exam/:id/play"
        element={
          <ProtectedRoute>
            <ExamPlayer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/results"
        element={
          <ProtectedRoute>
            <StudentLayout>
              <Result />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/exams/create"
        element={
          <AdminRoute>
            <AdminLayout>
              <CreateExam />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/exam/:id/questions"
        element={
          <AdminRoute>
            <AdminLayout>
              <ManageQuestions />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/monitor/:examId"
        element={
          <AdminRoute>
            <AdminLayout>
              <LiveMonitor />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/suspicious-logs/:examId"
        element={
          <AdminRoute>
            <AdminLayout>
              <SuspiciousLogs />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/results"
        element={
          <AdminRoute>
            <AdminLayout>
              <Results />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <AdminRoute>
            <AdminLayout>
              <Analytics />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <AdminRoute>
            <AdminLayout>
              <StudentManagement />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route path="*" element={<Navigate to="/student/login" replace />} />
    </Routes>
  );
}
