import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getQuestionsByExam, createQuestion, deleteQuestion, getAdminExamById } from '../../services/adminService';
//import { getQuestionsByExam, createQuestion, deleteQuestion } from '../../services/adminService';
import Loader from '../common/Loader';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

export default function ManageQuestions() {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    examId: id, questionText: '', questionType: 'mcq', options: ['', '', '', ''], correctAnswer: '', marks: 1,
  });

  const fetchData = async () => {
    try {
      const [examRes, qRes] = await Promise.all([getAdminExamById(id), getQuestionsByExam(id)]);
      setExam(examRes.data.exam);
      setQuestions(qRes.data.questions);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleOptionChange = (i, value) => {
    const opts = [...form.options];
    opts[i] = value;
    setForm({ ...form, options: opts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createQuestion(form);
      toast.success('Question added');
      setShowForm(false);
      setForm({ examId: id, questionText: '', questionType: 'mcq', options: ['', '', '', ''], correctAnswer: '', marks: 1 });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create question');
    }
  };

  const handleDelete = async (qId) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await deleteQuestion(qId);
      toast.success('Question deleted');
      fetchData();
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manage Questions</h1>
          <p className="text-gray-500">{exam?.title}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <FiPlus /> Add Question
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-lg font-semibold mb-4">New Question</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Question Text</label>
              <textarea name="questionText" value={form.questionText} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select name="questionType" value={form.questionType} onChange={handleChange} className="input-field">
                <option value="mcq">Multiple Choice</option>
                <option value="true_false">True / False</option>
                <option value="short_answer">Short Answer</option>
              </select>
            </div>
            {form.questionType === 'mcq' && (
              <div>
                <label className="block text-sm font-medium mb-1">Options</label>
                {form.options.map((opt, i) => (
                  <input key={i} value={opt} onChange={(e) => handleOptionChange(i, e.target.value)} className="input-field mb-2" placeholder={`Option ${i + 1}`} required />
                ))}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Correct Answer</label>
              <input name="correctAnswer" value={form.correctAnswer} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Marks</label>
              <input type="number" name="marks" value={form.marks} onChange={handleChange} className="input-field" required min={1} />
            </div>
            <button type="submit" className="btn-primary">Save Question</button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {questions.length === 0 ? (
          <div className="card text-center py-12 text-gray-500">No questions added yet.</div>
        ) : (
          questions.map((q, i) => (
            <div key={q._id} className="card flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-400 mb-1">Q{i + 1} &middot; {q.questionType} &middot; {q.marks} marks</p>
                <p className="font-medium">{q.questionText}</p>
                {q.options?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {q.options.map((opt, j) => (
                      <span key={j} className={`text-xs px-2 py-1 rounded ${opt === q.correctAnswer ? 'bg-success-100 text-success-700' : 'bg-gray-100 text-gray-500'}`}>
                        {opt}
                      </span>
                    ))}
                  </div>
                )}
                {q.questionType !== 'mcq' && (
                  <p className="text-xs text-success-600 mt-1">Answer: {q.correctAnswer}</p>
                )}
              </div>
              <button onClick={() => handleDelete(q._id)} className="text-gray-400 hover:text-danger-600 ml-4">
                <FiTrash2 />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
