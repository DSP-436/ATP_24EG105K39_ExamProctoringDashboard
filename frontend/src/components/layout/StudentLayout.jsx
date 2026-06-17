import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiBook, FiFileText, FiMenu, FiX } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';

export default function StudentLayout({ children }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/student/login');
  };

  const navLinks = [
    { to: '/student/dashboard', icon: FiUser, label: 'Dashboard' },
    { to: '/student/exams', icon: FiBook, label: 'Exams' },
    { to: '/student/results', icon: FiFileText, label: 'Results' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-primary-700">ExamProctor</h1>
              <div className="hidden md:flex gap-4">
                {navLinks.map(({ to, icon: Icon, label }) => (
                  <Link key={to} to={to} className="flex items-center gap-1 text-gray-600 hover:text-primary-600 px-3 py-2 rounded-lg text-sm font-medium">
                    <Icon /> {label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-sm text-gray-600">{user?.name}</span>
              <button onClick={handleLogout} className="flex items-center gap-1 text-gray-500 hover:text-danger-600 text-sm">
                <FiLogOut /> <span className="hidden sm:inline">Logout</span>
              </button>
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-600 hover:text-gray-800">
                {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t bg-white">
            {navLinks.map(({ to, icon: Icon, label }) => (
              <Link key={to} to={to} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-primary-600 text-sm font-medium border-b border-gray-100">
                <Icon /> {label}
              </Link>
            ))}
          </div>
        )}
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
