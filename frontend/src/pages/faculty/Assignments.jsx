import { useState, useEffect } from 'react';
import api from '../../services/api';
import { format } from 'date-fns';
import { Plus, Trash2, Calendar, BookOpen } from 'lucide-react';

const FacultyAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseCode: '',
    dueDate: '',
  });

  const fetchAssignments = async () => {
    try {
      const { data } = await api.get('/assignments');
      setAssignments(data);
    } catch (error) {
      console.error('Failed to fetch assignments');
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      try {
        await api.delete(`/assignments/${id}`);
        setAssignments(assignments.filter((a) => a._id !== id));
      } catch (error) {
        alert('Failed to delete assignment');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/assignments', formData);
      setShowModal(false);
      setFormData({ title: '', description: '', courseCode: '', dueDate: '' });
      fetchAssignments();
    } catch (error) {
      alert('Failed to create assignment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Assignments</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" /> New Assignment
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assignments.map((assignment) => (
          <div key={assignment._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded text-xs font-semibold">
                  {assignment.courseCode}
                </span>
                <button onClick={() => handleDelete(assignment._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{assignment.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                {assignment.description}
              </p>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4 mt-2">
              <Calendar className="w-4 h-4 mr-2" />
              Due: {format(new Date(assignment.dueDate), 'MMM d, yyyy')}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Create New Assignment</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    value={formData.courseCode}
                    onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  required
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyAssignments;
