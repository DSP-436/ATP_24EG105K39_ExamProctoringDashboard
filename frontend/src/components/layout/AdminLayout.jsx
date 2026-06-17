import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiBook, FiUsers, FiBarChart2, FiLogOut, FiFileText, FiMenu, FiX } from 'react-icons/fi';
import useAdminStore from '../../store/adminStore';

const navItems = [
  { path: '/admin/dashboard', icon: FiGrid, label: 'Dashboard' },
  { path: '/admin/exams/create', icon: FiBook, label: 'Create Exam' },
  { path: '/admin/results', icon: FiFileText, label: 'Results' },
  { path: '/admin/analytics', icon: FiBarChart2, label: 'Analytics' },
  { path: '/admin/students', icon: FiUsers, label: 'Students' },
];

export default function AdminLayout({ children }) {
  const { admin, logout } = useAdminStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-primary-700">ExamProctor</h1>
          <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="text-lg" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{admin?.name}</span>
            <button onClick={handleLogout} className="text-gray-400 hover:text-danger-600">
              <FiLogOut />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <nav className="bg-white shadow-sm border-b md:hidden">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-lg font-bold text-primary-700">ExamProctor</h1>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{admin?.name}</span>
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 text-gray-600 hover:text-gray-800">
                {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>
          {menuOpen && (
            <div className="border-t">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-6 py-3 text-sm font-medium border-b border-gray-100 ${
                      isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon /> {item.label}
                  </Link>
                );
              })}
              <button onClick={handleLogout} className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-500 hover:text-danger-600 w-full text-left border-b border-gray-100">
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </nav>
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
