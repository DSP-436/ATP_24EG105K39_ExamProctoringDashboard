import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createExam, getAdminExams, deleteExam, updateExam } from '../../services/examService';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiSave, FiX } from 'react-icons/fi';
import Loader from '../common/Loader';

export default function CreateExam() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', duration: 60, totalMarks: 100, passingMarks: 40,
    instructions: '', scheduledAt: '', endsAt: '',
  });

  const toDatetimeLocal = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const fetchExams = async () => {
    try {
      const res = await getAdminExams();
      setExams(res.data.exams);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExams(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openCreateForm = () => {
    setEditingExam(null);
    setForm({ title: '', description: '', duration: 60, totalMarks: 100, passingMarks: 40, instructions: '', scheduledAt: '', endsAt: '' });
    setShowForm(true);
  };

  const openEditForm = (exam) => {
    setEditingExam(exam);
    setForm({
      title: exam.title,
      description: exam.description || '',
      duration: exam.duration,
      totalMarks: exam.totalMarks,
      passingMarks: exam.passingMarks,
      instructions: exam.instructions || '',
      scheduledAt: toDatetimeLocal(exam.scheduledAt),
      endsAt: toDatetimeLocal(exam.endsAt),
    });
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingExam(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExam) {
        await updateExam(editingExam._id, form);
        toast.success('Exam updated!');
      } else {
        await createExam(form);
        toast.success('Exam created!');
      }
      cancelForm();
      fetchExams();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save exam');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this exam and all its questions?')) return;
    try {
      await deleteExam(id);
      toast.success('Exam deleted');
      fetchExams();
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Exams</h1>
        <button onClick={openCreateForm} className="btn-primary flex items-center gap-2">
          <FiPlus /> New Exam
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{editingExam ? 'Edit Exam' : 'Create New Exam'}</h2>
            <button type="button" onClick={cancelForm} className="text-gray-400 hover:text-gray-600"><FiX size={20} /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input name="title" value={form.title} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                <input type="number" name="duration" value={form.duration} onChange={handleChange} className="input-field" required min={1} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total Marks</label>
                <input type="number" name="totalMarks" value={form.totalMarks} onChange={handleChange} className="input-field" required min={1} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Passing Marks</label>
                <input type="number" name="passingMarks" value={form.passingMarks} onChange={handleChange} className="input-field" required min={0} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Scheduled At</label>
                <input type="datetime-local" name="scheduledAt" value={form.scheduledAt} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ends At</label>
                <input type="datetime-local" name="endsAt" value={form.endsAt} onChange={handleChange} className="input-field" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="input-field" rows={2} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Instructions</label>
              <textarea name="instructions" value={form.instructions} onChange={handleChange} className="input-field" rows={3} />
            </div>
            <button type="submit" className="btn-primary flex items-center gap-1">
              <FiSave /> {editingExam ? 'Update Exam' : 'Create Exam'}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {exams.length === 0 ? (
          <div className="card text-center py-12 text-gray-500">No exams created yet.</div>
        ) : (
          exams.map((exam) => (
            <div key={exam._id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-semibold break-words">{exam.title}</h3>
                <p className="text-sm text-gray-500">{exam.duration}min | {exam.totalMarks} marks | {exam.questions?.length || 0} questions | {exam.isActive ? 'Active' : 'Inactive'}</p>
                <p className="text-xs text-gray-400 mt-0.5 break-words">{new Date(exam.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} {new Date(exam.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(exam.endsAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} {new Date(exam.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => openEditForm(exam)} className="btn-outline text-sm px-3 py-1.5 flex items-center gap-1">
                  <FiEdit2 /> Edit
                </button>
                <button onClick={() => navigate(`/admin/exam/${exam._id}/questions`)} className="btn-outline text-sm px-3 py-1.5 flex items-center gap-1">
                  <FiEdit2 /> Questions
                </button>
                <button onClick={() => navigate(`/admin/monitor/${exam._id}`)} className="btn-outline text-sm px-3 py-1.5 flex items-center gap-1">
                  <FiEye /> Monitor
                </button>
                <button onClick={() => handleDelete(exam._id)} className="btn-danger text-sm px-3 py-1.5 flex items-center gap-1">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
