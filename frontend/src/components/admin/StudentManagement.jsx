import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useAdminStore from '../../store/adminStore';
import { toggleStudentStatus } from '../../services/adminService';
import { FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import Loader from '../common/Loader';

export default function StudentManagement() {
  const { students, fetchStudents, loading } = useAdminStore();

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const handleToggle = async (id) => {
    try {
      await toggleStudentStatus(id);
      toast.success('Status updated');
      fetchStudents();
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Student Management</h1>
      <div className="card overflow-x-auto">
        {students.length === 0 ? (
          <p className="text-center py-12 text-gray-500">No students registered.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-semibold">Name</th>
                <th className="pb-3 font-semibold">Email</th>
                <th className="pb-3 font-semibold">Registered</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{s.name}</td>
                  <td className="py-3 text-gray-500">{s.email}</td>
                  <td className="py-3 text-gray-500 text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      s.isActive ? 'bg-success-100 text-success-700' : 'bg-danger-100 text-danger-700'
                    }`}>{s.isActive ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td className="py-3">
                    <button onClick={() => handleToggle(s._id)} className={`flex items-center gap-1 text-sm ${
                      s.isActive ? 'text-danger-600 hover:text-danger-700' : 'text-success-600 hover:text-success-700'
                    }`}>
                      {s.isActive ? <FiToggleLeft /> : <FiToggleRight />}
                      {s.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
